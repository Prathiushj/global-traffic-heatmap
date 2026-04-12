from fastapi import APIRouter
from app.services.opensky import fetch_opensky_data
from app.database import SessionLocal
from app.models.flight import Flight
from sqlalchemy.exc import IntegrityError
import random

router = APIRouter()

@router.get("/flights")
def get_live_flights():

    db = SessionLocal()

    flights = fetch_opensky_data()
   
    if not flights:
        print("Using dynamic fallback data")

        flights = []

        for i in range(10):
            flights.append({
                "flight_id": f"F{i}",
                "lat": 20.5937 + random.uniform(-5, 5),
                "lon": 78.9629 + random.uniform(-5, 5),
                "altitude": random.uniform(8000, 12000),
                "timestamp": "2026"
            })
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
