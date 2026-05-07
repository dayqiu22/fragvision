import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def db_connect():
	if not DATABASE_URL:
		raise ValueError("Missing DATABASE_URL in .env file")
	conn = psycopg2.connect(DATABASE_URL)
	cursor = conn.cursor()
	return conn, cursor