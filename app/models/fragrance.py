from enum import StrEnum
from pydantic import BaseModel

class Gender(StrEnum):
    MEN = "men"
    WOMEN = "women"
    UNISEX = "unisex"

class Fragrance(BaseModel):
	url: str
	name: str
	brand: str
	gender: Gender
	rating: float
	decade: str
	description: str
