from app.models.fragrance import Fragrance
from pydantic import BaseModel

class SearchResults(BaseModel):
    perfumes: list[Fragrance]