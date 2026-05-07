from fastapi import FastAPI, status
from app.routes.recommendationsRoute import recommendations_router
from app.routes.similarSearchesRoute import similar_searches_router

app = FastAPI()

@app.get("/", status_code=status.HTTP_200_OK)
def api_check():
    return {"message": "Sanity check OK"}

app.include_router(recommendations_router)
app.include_router(similar_searches_router)