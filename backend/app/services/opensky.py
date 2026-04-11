import requests

def fetch_opensky_data():
    url = "https://opensky-network.org/api/states/all"

    try:
        response = requests.get(url, timeout=30)

        # Check status
        if response.status_code != 200:
            print("OpenSky API failed:", response.status_code)
            return []

        data = response.json()

        if "states" not in data or data["states"] is None:
            print("No flight data received")
            return []

        flights = []

        for state in data["states"][:20]:  # limit to 20
            flights.append({
                "flight_id": state[0],
                "lat": state[6],
                "lon": state[5],
                "altitude": state[7],
                "timestamp": data.get("time", 0)
            })

        return flights

    except Exception as e:
        print("OpenSky API error:", e)
        return []