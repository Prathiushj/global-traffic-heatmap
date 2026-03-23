import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

function HeatmapLayer({ flights }) {
  const map = useMap();

  useEffect(() => {
    if (!flights || flights.length === 0) return;

    const heatData = flights
      .filter(f => f.lat != null && f.lon != null)
      .map(f => [f.lat, f.lon, 1]);

   const heatLayer = L.heatLayer(heatData, {
  radius: 50,
  blur: 30,
  maxZoom: 6,
  gradient: {
    0.2: "blue",
    0.4: "lime",
    0.6: "yellow",
    1.0: "red"
  }
});

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [flights, map]);

  return null;
}

function App() {

  const [flights, setFlights] = useState([]);

 useEffect(() => {

  // TEMPORARY DUMMY DATA
  const dummyFlights = [
  // India cluster
  { flight_id: "AI101", lat: 28.61, lon: 77.20, altitude: 10000 },
  { flight_id: "AI102", lat: 28.62, lon: 77.21, altitude: 10500 },
  { flight_id: "AI103", lat: 28.63, lon: 77.22, altitude: 11000 },

  // Europe cluster
  { flight_id: "EU201", lat: 48.85, lon: 2.35, altitude: 12000 },
  { flight_id: "EU202", lat: 48.86, lon: 2.36, altitude: 11500 },
  { flight_id: "EU203", lat: 48.87, lon: 2.34, altitude: 11800 },

  // USA cluster
  { flight_id: "US301", lat: 40.71, lon: -74.00, altitude: 13000 },
  { flight_id: "US302", lat: 40.72, lon: -74.01, altitude: 12800 },
  { flight_id: "US303", lat: 40.73, lon: -74.02, altitude: 12700 },
];

  setFlights(dummyFlights);

}, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div
        style={{
          background: "#1f2937",
          color: "white",
          padding: "12px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold"
        }}
      >
        🌍 Global Flight Traffic Heatmap
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div
          style={{
            width: "260px",
            background: "#f3f4f6",
            padding: "12px",
            overflowY: "auto",
            borderRight: "1px solid #ddd"
          }}
        >
          <h3>Flight Info</h3>

          <p><b>Total Flights:</b> {flights.length}</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {flights.map((f, index) => (
              <li
                key={index}
                style={{
                  background: "white",
                  padding: "8px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                ✈ <b>{f.flight_id}</b> <br />
                Alt: {f.altitude ? Math.round(f.altitude) : "N/A"} m
              </li>
            ))}
          </ul>

        </div>

        {/* Map */}
        <div style={{ flex: 1 }}>

          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={3}
            style={{ height: "100%" }}
          >

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <HeatmapLayer flights={flights} />

            {/* {flights.map((flight, index) => {

              if (flight.lat == null || flight.lon == null) return null;

              return (
                <Marker key={index} position={[flight.lat, flight.lon]}>
                  <Popup>
                    ✈ <b>Flight:</b> {flight.flight_id} <br />
                    Altitude: {flight.altitude ? Math.round(flight.altitude) : "N/A"} m <br />
                    Lat: {flight.lat.toFixed(2)} <br />
                    Lon: {flight.lon.toFixed(2)}
                  </Popup>
                </Marker>
              );
            })} */}

          </MapContainer>

        </div>

      </div>
    </div>
  );
}

export default App;