import requests

def fetch_opensky_data():

    url = "https://opensky-network.org/api/states/all"

    try:
        response = requests.get(url, timeout=20)
        data = response.json()

    except Exception as e:
        print("OpenSky API error:", e)
        return []

    flights = []

    for state in data["states"][:20]:

        flight = {
            "flight_id": state[0],
            "lat": state[6],
            "lon": state[5],
            "altitude": state[7],
            "timestamp": data["time"]
        }

        flights.append(flight)

    return flights