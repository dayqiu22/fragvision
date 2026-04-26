import psycopg2
from app.models.fragrance import Fragrance
from app.services.retrieve.embed import get_embeddings

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DATABASE_URL = os.getenv("DATABASE_URL")

def db_connect():
	if not DATABASE_URL:
		raise ValueError("Missing DATABASE_URL in .env file")
	conn = psycopg2.connect(DATABASE_URL)
	cursor = conn.cursor()
	return conn, cursor

def knn(texts, k=5) -> List[Fragrance]:
	"""
	Performs k-nearest neighbors search with pgvector.
	"""
	query_embedding = get_embeddings(texts)

	conn, cursor = db_connect()
	cursor.execute("""
	SELECT url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	ORDER BY embedding <=> %s
	LIMIT %s;
	""", (query_embedding, k))
	results = cursor.fetchall()
	cursor.close()
	conn.close()

	return [Fragrance(*row) for row in results]
