from pydantic import BaseModel
from app.models.fragrance import Gender

class UserPrompt(BaseModel):
    brand: str | None
    gender: Gender = Gender.UNISEX
    lower_decade: int | None
    upper_decade: int | None
    rating: float | None
    top_notes: list[str] | None
    middle_notes: list[str] | None
    base_notes: list[str] | None
    accords: list[str]
    num_recommendations: int = 5