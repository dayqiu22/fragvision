import psycopg2
import os
from dotenv import load_dotenv
from app.models.fragrance import Fragrance, Gender
from app.models.recommend.userPrompt import UserPrompt
from app.services.recommend.embed import get_embedding

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DATABASE_URL = os.getenv("DATABASE_URL")

def db_connect():
	if not DATABASE_URL:
		raise ValueError("Missing DATABASE_URL in .env file")
	conn = psycopg2.connect(DATABASE_URL)
	cursor = conn.cursor()
	return conn, cursor

def build_where(user_prompt: UserPrompt) -> tuple[str, list[str]]:
	query = """
	SELECT url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	"""
	where_clauses = []
	params = []
	if user_prompt.brand:
		where_clauses.append("brand = %s")
		params.append(user_prompt.brand)

	if user_prompt.gender == Gender.UNISEX:
		where_clauses.append("gender = %s")
		params.append(user_prompt.gender)
	else:
		where_clauses.append("(gender = %s OR gender = %s)")
		params.append(user_prompt.gender)
		params.append(Gender.UNISEX)
		
	if user_prompt.rating:
		where_clauses.append("rating >= %s")
		params.append(user_prompt.rating)
		
	if user_prompt.lower_decade:
		where_clauses.append("decade >= %s")
		params.append(user_prompt.lower_decade)

	if user_prompt.upper_decade:
		where_clauses.append("decade <= %s")
		params.append(user_prompt.upper_decade)
	
	if where_clauses:
		query += " WHERE " + " AND ".join(where_clauses)
		
	query += " ORDER BY embedding <=> %s LIMIT %s;"
	return query, params

def knn(user_prompt: UserPrompt) -> list[Fragrance]:
	"""
	Performs k-nearest neighbors search with pgvector.
	"""
	query_embedding = get_embedding(user_prompt)
	query, params = build_where(user_prompt)

	conn, cursor = db_connect()
	cursor.execute(query, params + [str(query_embedding), user_prompt.num_recommendations])
	results = cursor.fetchall()
	cursor.close()
	conn.close()

	return [
		Fragrance(
			url=row[0], 
			name=row[1], 
			brand=row[2], 
			gender=row[3], 
            rating=row[4], 
            decade=row[5],
            description=row[6]
        ) for row in results
    ]
