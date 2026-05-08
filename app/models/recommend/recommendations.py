from app.models.fragrance import Fragrance
from pydantic import BaseModel

class Recommendations(BaseModel):
    fragrances: list[Fragrance]