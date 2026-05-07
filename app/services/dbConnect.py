import os
from psycopg2 import pool
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
	raise ValueError("Missing DATABASE_URL in .env file")

db_pool = pool.ThreadedConnectionPool(1, 10, DATABASE_URL)

@contextmanager
def get_db_cursor():
	"""
	Context manager to borrow a connection and cursor from the pool.
	Automatically handles commits, rollbacks, and returning the connection.
	"""
	conn = db_pool.getconn()
	cursor = conn.cursor()
	try:
		yield conn, cursor
		conn.commit()
	except Exception:
		conn.rollback()
		raise
	finally:
		cursor.close()
		db_pool.putconn(conn)