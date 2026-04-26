import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def get_embeddings(texts, model="gemini-embedding-001"):
	"""
	Calls the gemini-embedding-001 model to vectorize text.
	"""
	if not GEMINI_API_KEY:
		raise ValueError("Missing GEMINI_API_KEY in .env file")
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