from fastapi import APIRouter, status
from app.services.similar_search.search import search
from app.models.similar_search.searchResults import SearchResults

similar_searches_router = APIRouter()

@similar_searches_router.get("/searches", status_code=status.HTTP_200_OK, response_model=SearchResults)
def get_searches(input_text: str, limit: int = 8) -> SearchResults:
	return SearchResults(perfumes=search(input_text, limit))