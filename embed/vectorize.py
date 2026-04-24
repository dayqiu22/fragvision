import os
import time
import pandas as pd
import psycopg2
from pgvector.psycopg2 import register_vector
from google import genai
from google.genai import types
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
client = genai.Client()
DATABASE_URL = os.getenv("DATABASE_URL")

def db_connect():
	if not DATABASE_URL or not os.getenv("GEMINI_API_KEY"):
		raise ValueError("Missing DATABASE_URL or GEMINI_API_KEY in .env file")

	print("Connecting to Supabase PostgreSQL...")
	conn = psycopg2.connect(DATABASE_URL)
	cursor = conn.cursor()
	
	print("Setting up pgvector extension and table...")
	cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
	cursor.execute("DROP TABLE IF EXISTS perfume_vectors;")
	
	cursor.execute("""
	CREATE TABLE IF NOT EXISTS perfume_vectors (
		id SERIAL PRIMARY KEY,
		url TEXT,
		name TEXT,
		brand TEXT,
		gender TEXT,
		rating FLOAT,
		decade TEXT,
		description TEXT,
		embedding vector(3072)
	);
	""")
	conn.commit()
	
	register_vector(conn)
	return conn, cursor

def load_data(csv_path):
	print("Loading Dataset...")
	df = pd.read_csv(csv_path)
	return df

def create_description(row):
	"""
	Converts dataframe row into a text paragraph for the embedding model.
	"""
	perfume = str(row['Perfume']) if pd.notna(row.get('Perfume')) else "Unknown"
	brand = str(row['Brand']) if pd.notna(row.get('Brand')) else "Unknown"
	gender = str(row['Gender']) if pd.notna(row.get('Gender')) else "unisex"
	decade = str(row['Decade']) if pd.notna(row.get('Decade')) else "Unknown"
	rating = row.get('Rating')

	desc = f"Perfume '{perfume}' by brand '{brand}' is a {gender} fragrance"
	if decade and decade != 'Unknown':
		desc += f" from the {decade}"
	
	if pd.notna(rating):
		try:
			desc += f" with a rating of {float(rating)}."
		except ValueError:
			desc += "."
	else:
		desc += "."
		
	top = row.get('Top')
	if pd.notna(top) and str(top).strip():
		desc += f" The top notes feature {top}."
		
	middle = row.get('Middle')
	if pd.notna(middle) and str(middle).strip():
		desc += f" The middle notes include {middle}."
		
	base = row.get('Base')
	if pd.notna(base) and str(base).strip():
		desc += f" The base notes are {base}."
		
	accords = []
	for i in range(1, 6):
		val = row.get(f'mainaccord{i}')
		if pd.notna(val) and str(val).strip():
			accords.append(str(val).strip())
			
	if accords:
		 desc += f" Its main olfactory accords are {', '.join(accords)}."
		 
	return desc

def get_embeddings(texts, model="gemini-embedding-001"):
	"""
	Calls the gemini-embedding-001 model to vectorize text.
	"""
	max_retries = 5
	for attempt in range(max_retries):
		try:
			res = client.models.embed_content(
				model=model,
				contents=texts,
				config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
			)
			return [e.values for e in res.embeddings]
		except Exception as e:
			if "RESOURCE_EXHAUSTED" in str(e):
				if attempt == max_retries - 1:
					raise
				print(f"Resource exhausted. Waiting 1 minute... (Attempt {attempt + 1}/{max_retries})")
				time.sleep(60)
			else:
				raise

def main():
	conn, cursor = db_connect()

	df = load_data(os.path.join(os.path.dirname(__file__), "..", "data", "fra_cleaned.csv"))
	print(f"Loaded {len(df)} rows. Processing in batches of 100...")
	
	batch_size = 100
	for i in tqdm(range(0, len(df), batch_size)):
		batch_df = df.iloc[i:i+batch_size]
		
		descriptions = [create_description(row) for _, row in batch_df.iterrows()]
		
		embeddings = get_embeddings(descriptions)
		
		insert_query = """
		INSERT INTO perfume_vectors (url, name, brand, gender, rating, decade, description, embedding)
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
		"""
		
		values_to_insert = []
		for idx, (_, row) in enumerate(batch_df.iterrows()):
			rating_val = row.get("Rating")
			rating = float(rating_val) if pd.notna(rating_val) else None
			
			values_to_insert.append((
				str(row.get("url", "")),
				str(row.get("Perfume", "")),
				str(row.get("Brand", "")),
				str(row.get("Gender", "unisex")),
				rating,
				str(row.get("Decade", "")),
				descriptions[idx],
				embeddings[idx] # The 3072-dimensional vector
			))
			
		cursor.executemany(insert_query, values_to_insert)
		conn.commit()

	print("100% Done!")
	cursor.close()
	conn.close()

if __name__ == "__main__":
	main()
