from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.routes.recommendationsRoute import recommendations_router
from app.routes.similarSearchesRoute import similar_searches_router
from app.routes.fragrancesRoute import fragrances_router

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", status_code=status.HTTP_200_OK)
def api_check():
    return {"message": "Sanity check OK"}

app.include_router(recommendations_router)
app.include_router(similar_searches_router)
app.include_router(fragrances_router)