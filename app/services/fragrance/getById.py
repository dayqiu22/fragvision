from app.models.fragrance import Fragrance
from app.services.dbConnect import get_db_cursor

def get_by_id(id: int) -> Fragrance:
	"""
	Retrieves a fragrance by its ID.
	"""
	query = """
	SELECT id, url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	WHERE id = %s;
	"""

	with get_db_cursor() as (conn, cursor):
		cursor.execute(query, [id])
		results = cursor.fetchone()

	if not results:
		raise ValueError("Fragrance not found")

	return Fragrance(
		id=results[0],
		url=results[1],
		name=results[2],
		brand=results[3],
		gender=results[4],
		rating=results[5],
		decade=results[6],
		description=results[7]
    )