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