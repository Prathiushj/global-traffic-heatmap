from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.flights import router as flights_router

app = FastAPI(title="Global Flight Heatmap API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Global Flight Heatmap Backend Running"}

app.include_router(flights_router)