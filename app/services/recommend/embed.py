import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.models.recommend.userPrompt import UserPrompt

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

def create_prompt_text(user_prompt: UserPrompt) -> str:
	brand = user_prompt.brand.title() or " "
	gender = user_prompt.gender
	lower_decade = user_prompt.lower_decade
	upper_decade = user_prompt.upper_decade
	rating = user_prompt.rating

	text = f"Perfume ' ' by brand '{brand}' is a {gender} fragrance released"
	if lower_decade and upper_decade:
		if lower_decade != upper_decade:
			text += f" between the {lower_decade} and the {upper_decade}"
		else:
			text += f" in the {lower_decade}"
	
	if rating:
		text += f" with a rating of {float(rating)}"
	text += "."
		
	top = user_prompt.top_notes
	if top:
		text += f" The top notes feature {', '.join(top)}."
		
	middle = user_prompt.middle_notes
	if middle:
		text += f" The middle notes include {', '.join(middle)}."
		
	base = user_prompt.base_notes
	if base:
		text += f" The base notes are {', '.join(base)}."
		
	accords = user_prompt.accords
	text += f" Its main olfactory accords are {', '.join(accords)}."
	return text

def get_embedding(user_prompt: UserPrompt, model: str = "gemini-embedding-001") -> list[list[float]]:
	"""
	Calls the gemini-embedding-001 model to vectorize text.
	"""
	if not GEMINI_API_KEY:
		raise ValueError("Missing GEMINI_API_KEY in .env file")

	text = create_prompt_text(user_prompt)

	max_retries = 5
	for attempt in range(max_retries):
		try:
			res = client.models.embed_content(
				model=model,
				contents=text,
				config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
			)
			return res.embeddings[0].values
		except Exception as e:
			if "RESOURCE_EXHAUSTED" in str(e):
				if attempt == max_retries - 1:
					raise
				print(f"Resource exhausted. Waiting 1 minute... (Attempt {attempt + 1}/{max_retries})")
				time.sleep(60)
			else:
				raise