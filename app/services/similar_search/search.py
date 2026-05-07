from app.models.fragrance import Fragrance
from app.services.dbConnect import get_db_cursor

def search(input_text: str, limit: int = 8) -> list[Fragrance]:
	"""
	Performs trigram fuzzy search and returns top 8 results
	"""
	query = """
	SELECT url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	ORDER BY (coalesce(brand, '') || ' ' || coalesce(name, '')) <-> %s
	LIMIT %s;
	"""

	with get_db_cursor() as (conn, cursor):
		cursor.execute(query, [input_text, limit])
		results = cursor.fetchall()

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