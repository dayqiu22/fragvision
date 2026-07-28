from app.models.fragrance import Fragrance
from app.services.dbConnect import get_db_cursor

def knn(fragrance_id: int, limit: int) -> list[Fragrance]:
	"""
	Performs k-nearest neighbors search with pgvector
	given a specific fragrance id.
	"""
	embedding_query = "SELECT embedding FROM perfume_vectors WHERE id = %s;"
	query = """
	SELECT id, url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	WHERE id != %s
	ORDER BY embedding <=> (%s)::halfvec(3072)
	LIMIT %s;
	"""

	with get_db_cursor() as (conn, cursor):
		cursor.execute(embedding_query, [fragrance_id])
		embedding = cursor.fetchone()[0]
		cursor.execute(query, [fragrance_id, embedding, limit])
		results = cursor.fetchall()

	return [
		Fragrance(
			id=row[0], 
			url=row[1], 
			name=row[2], 
			brand=row[3], 
			gender=row[4], 
            rating=row[5], 
            decade=row[6],
            description=row[7]
        ) for row in results
    ]
