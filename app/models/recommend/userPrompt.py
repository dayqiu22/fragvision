from pydantic import BaseModel
from app.models.fragrance import Gender

class UserPrompt(BaseModel):
    brand: str | None
    gender: Gender = Gender.UNISEX
    lower_decade: str | None
    upper_decade: str | None
    rating: float | None
    top_notes: list[str] | None
    middle_notes: list[str] | None
    base_notes: list[str] | None
    accords: list[str]
    num_recommendations: int = 5