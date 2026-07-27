from fastapi import APIRouter, status
from app.models.fragrance import Fragrance
from app.services.fragrance.getById import get_by_id

fragrances_router = APIRouter()

@fragrances_router.get("/fragrances/{id}", status_code=status.HTTP_200_OK)
def get_fragrance(id: int) -> Fragrance:
	return get_by_id(id)
