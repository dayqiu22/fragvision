from fastapi import APIRouter, status
from app.services.recommend.knn import knn
from app.models.recommend.userPrompt import UserPrompt
from app.models.recommend.recommendations import Recommendations

recommendations_router = APIRouter()

@recommendations_router.post("/recommendations", status_code=status.HTTP_200_OK, response_model=Recommendations)
def post_recommendations(user_prompt: UserPrompt) -> Recommendations:
	return Recommendations(fragrances=knn(user_prompt))