import requests
from fastapi import FastAPI
import psycopg2

app = FastAPI()

DB_URL = "postgresql://postgres.ubokkgfwyfzvtrmktsyn:Mohammed%4051245232@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"


# ------------------------------
# Home Endpoint
# ------------------------------
@app.get("/")
def home():
    return {"message": "Heatmap Backend Running"}


# ------------------------------
# Test Database Connection
# ------------------------------
@app.get("/test-db")
def test_db():
    try:
        conn = psycopg2.connect(DB_URL)
        conn.close()
        return {"status": "Database Connected Successfully"}
    except Exception as e:
        return {"error": str(e)}


# ------------------------------
# Get Flights from Database
# ------------------------------
@app.get("/flights")
def get_flights():
    conn = psycopg2.connect(DB_URL)

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM flights")
    data = cursor.fetchall()

    conn.close()

    return {"flights": data}


# ------------------------------
# Fetch Flights from OpenSky API
# ------------------------------
@app.get("/fetch-flights")
def fetch_flights():
    url = "https://opensky-network.org/api/states/all"
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "Failed to fetch data"}

    data = response.json()

    return {
        "total_flights": len(data.get("states", []))
    }


# ------------------------------
# Clean Flights Data
# ------------------------------
@app.get("/clean-flights")
def clean_flights():
    url = "https://opensky-network.org/api/states/all"
    response = requests.get(url)

    if response.status_code != 200:
        return {"error": "Failed to fetch data"}

    states = response.json().get("states", [])
    cleaned = []

    for flight in states:
        longitude = flight[5]
        latitude = flight[6]
        altitude = flight[7]

        if latitude is not None and longitude is not None:
            cleaned.append({
                "latitude": latitude,
                "longitude": longitude,
                "altitude": altitude
            })

    return {
        "cleaned_count": len(cleaned),
        "sample": cleaned[:5]
    }


# ------------------------------
# Store Flights in Supabase DB
# ------------------------------
@app.post("/store-flights")
def store_flights():
    url = "https://opensky-network.org/api/states/all"
    response = requests.get(url, timeout=10)

    if response.status_code != 200:
        return {"error": "Failed to fetch data"}

    states = response.json().get("states", [])

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    inserted = 0

    for flight in states[:50]:
        longitude = flight[5]
        latitude = flight[6]
        altitude = flight[7]

        if latitude is not None and longitude is not None:
            flight_id = str(inserted)

            cur.execute("""
                INSERT INTO flights (flight_id, lat, lon, altitude, timestamp)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (flight_id) DO NOTHING
            """, (
                flight_id,
                latitude,
                longitude,
                altitude,
                "2026"
            ))

            inserted += 1

    conn.commit()
    cur.close()
    conn.close()

    return {"inserted_records": inserted}


# ------------------------------
# Get Locations for Heatmap
# ------------------------------
@app.get("/locations")
def get_locations():

    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("""
        SELECT lat, lon
        FROM flights
        LIMIT 200
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return {"locations": rows}