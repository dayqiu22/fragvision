from app.models.fragrance import Fragrance, Gender
from app.models.recommend.userPrompt import UserPrompt
from app.services.recommend.embed import get_embedding
from app.services.dbConnect import get_db_cursor

def build_query(user_prompt: UserPrompt) -> tuple[str, list[str]]:
	query = """
	SELECT id, url, name, brand, gender, rating, decade, description
	FROM perfume_vectors
	"""
	where_clauses = []
	params = []
	if user_prompt.brand:
		where_clauses.append("brand = %s")
		params.append(user_prompt.brand.title())

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
	Performs k-nearest neighbors search with pgvector
	given user preferences.
	"""
	query_embedding = get_embedding(user_prompt)
	query, params = build_query(user_prompt)

	with get_db_cursor() as (conn, cursor):
		cursor.execute(query, params + [str(query_embedding), user_prompt.num_recommendations])
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
