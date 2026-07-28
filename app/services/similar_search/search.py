from app.models.fragrance import Fragrance
from app.services.dbConnect import get_db_cursor

def search(input_text: str) -> list[Fragrance]:
	"""
	Performs trigram fuzzy search and returns top results.
	"""
	limit = 8
	query = """
	SELECT id, url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	WHERE similarity(coalesce(brand, '') || ' ' || coalesce(name, ''), %s) > 0.15
	ORDER BY (coalesce(brand, '') || ' ' || coalesce(name, '')) <-> %s
	LIMIT %s;
	"""

	with get_db_cursor() as (conn, cursor):
		cursor.execute(query, [input_text, input_text, limit])
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