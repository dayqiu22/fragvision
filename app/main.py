from fastapi import FastAPI, status
from app.routes.recommendationsRoute import recommendations_router

app = FastAPI()

@app.get("/", status_code=status.HTTP_200_OK)
def api_check():
    return {"message": "Sanity check OK"}

app.include_router(recommendations_router)