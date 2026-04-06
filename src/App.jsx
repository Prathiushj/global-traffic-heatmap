import { MapContainer, TileLayer } from "react-leaflet";
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
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:8000/flights"); // ✅ correct
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();

    const interval = setInterval(fetchFlights, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        background: "#1f2937",
        color: "white",
        padding: "12px",
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "bold"
      }}>
        🌍 Global Flight Traffic Heatmap
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        <div style={{
          width: "260px",
          background: "#f3f4f6",
          padding: "12px",
          overflowY: "auto",
          borderRight: "1px solid #ddd"
        }}>
          <h3>Flight Info</h3>
          <p><b>Total Flights:</b> {flights.length}</p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {flights.map((f, index) => (
              <li key={index} style={{
                background: "white",
                padding: "8px",
                marginBottom: "6px",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
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
          </MapContainer>
        </div>

      </div>
    </div>
  );
}

export default App;