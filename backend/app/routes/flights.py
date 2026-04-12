from fastapi import APIRouter
from app.services.opensky import fetch_opensky_data
from app.database import SessionLocal
from app.models.flight import Flight
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.get("/flights")
def get_live_flights():

    db = SessionLocal()

    flights = fetch_opensky_data()
    if not flights:
        print("Using fallback data")

        flights = [
            {"flight_id": "F1", "lat": 20.5937, "lon": 78.9629, "altitude": 10000, "timestamp": "2026"},
            {"flight_id": "F2", "lat": 28.6139, "lon": 77.2090, "altitude": 12000, "timestamp": "2026"},
            {"flight_id": "F3", "lat": 19.0760, "lon": 72.8777, "altitude": 9000, "timestamp": "2026"},
            {"flight_id": "F4", "lat": 13.0827, "lon": 80.2707, "altitude": 11000, "timestamp": "2026"},
            {"flight_id": "F5", "lat": 22.5726, "lon": 88.3639, "altitude": 9500, "timestamp": "2026"},
        ]

    for f in flights:

        if f["lat"] is None or f["lon"] is None:
            continue

        try:
            record = Flight(
                flight_id=str(f["flight_id"]),
                lat=f["lat"],
                lon=f["lon"],
                altitude=f["altitude"],
                timestamp=str(f["timestamp"])
            )

            db.merge(record)

        except IntegrityError:
            db.rollback()

    db.commit()
    db.close()

    return flights
