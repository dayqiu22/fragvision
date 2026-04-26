from fastapi import APIRouter, FastAPI

app = FastAPI()
router = APIRouter()

@router.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(router)