from fastapi import APIRouter, status
from app.services.similar_search.search import search
from app.services.similar_search.knn import knn
from app.models.similar_search.searchResults import SearchResults

similar_searches_router = APIRouter()

@similar_searches_router.get("/searches", status_code=status.HTTP_200_OK, response_model=SearchResults)
def get_searches(input_text: str, limit: int = 8) -> SearchResults:
	return SearchResults(fragrances=search(input_text, limit))

@similar_searches_router.get(
	"/searches/{fragrance_id}", 
	status_code=status.HTTP_200_OK, 
	response_model=SearchResults
)
def get_similars(fragrance_id: int, limit: int = 8) -> SearchResults:
	return SearchResults(fragrances=knn(fragrance_id, limit))