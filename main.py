from fastapi import FastAPI

app = FastAPI(title="Global Flight Heatmap API")

@app.get("/flights")
def get_flights():
    return [
        {"lat": 12.9716, "lon": 77.5946, "altitude": 30000},
        {"lat": 28.6139, "lon": 77.2090, "altitude": 32000},
        {"lat": 19.0760, "lon": 72.8777, "altitude": 28000}
    ]
