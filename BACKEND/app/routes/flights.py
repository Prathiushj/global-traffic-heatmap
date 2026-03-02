from fastapi import APIRouter

router = APIRouter()

@router.get("/flights")
def get_dummy_flights():
    return [
        {"flight_id": "AI101", "lat": 12.97, "lon": 77.59, "altitude": 30000, "timestamp": "10:30"},
        {"flight_id": "EK202", "lat": 28.61, "lon": 77.20, "altitude": 32000, "timestamp": "10:31"},
        {"flight_id": "QR303", "lat": 19.07, "lon": 72.87, "altitude": 28000, "timestamp": "10:32"}
    ]