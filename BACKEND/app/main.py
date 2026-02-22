from fastapi import FastAPI
from app.routes.flights import router as flights_router

app = FastAPI(title="Global Flight Heatmap API")

@app.get("/")
def root():
    return {"message": "Global Flight Heatmap Backend Running"}

# include routes
app.include_router(flights_router)