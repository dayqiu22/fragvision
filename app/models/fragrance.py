from enum import StrEnum
from pydantic import BaseModel

class Gender(StrEnum):
    MALE = "male"
    FEMALE = "female"
    UNISEX = "unisex"

class Fragrance(BaseModel):
	id: int
	url: str
	name: str
	brand: str
	gender: Gender
	rating: float | None
	decade: int | None
	description: str
