import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";

// ✅ Fix marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// 🔥 Heatmap Layer
function HeatmapLayer({ flights, radius }) {
  const map = useMap();

  useEffect(() => {
    if (!flights || flights.length === 0) return;

    const heatData = flights
      .filter(f => f.lat != null && f.lon != null)
      .map(f => [f.lat, f.lon, 1]);

    const heatLayer = L.heatLayer(heatData, {
      radius: radius,
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
  }, [flights, map, radius]);

  return null;
}

// 🔥 Change map center dynamically
function ChangeMapView({ center }) {
  const map = useMap();
  map.setView(center, 5);
  return null;
}

function App() {
  const [flights, setFlights] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [radius, setRadius] = useState(50);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [search, setSearch] = useState("");
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("https://flight-backend-q6am.onrender.com/flights");
        const data = await response.json();
        setFlights(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000);

    return () => clearInterval(interval);
  }, []);

  // 🔍 Search handler
  const handleSearch = async () => {
    if (!search) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const validFlights = flights.filter(f => f.lat && f.lon);

  const avgAltitude =
    flights.length > 0
      ? Math.round(
          flights.reduce((sum, f) => sum + (f.altitude || 0), 0) /
            flights.length
        )
      : 0;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ✅ Header */}
      <div
        style={{
          background: "#111827",
          color: "white",
          padding: "12px",
          textAlign: "center",
          fontSize: "18px",
          fontWeight: "bold"
        }}
      >
        🌍 Global Flight Traffic Heatmap
      </div>

      {/* ✅ Main Layout */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ✅ Sidebar */}
        <div
          style={{
            width: "260px",
            background: "#111827",
            color: "white",
            padding: "12px",
            overflowY: "auto",
            borderRight: "1px solid #333",
            lineHeight: "1.6"
          }}
        >
          <h3>📊 Flight Info</h3>

          {flights.length === 0 ? (
            <p>🔄 Fetching flight data...</p>
          ) : (
            <>
              <p><b>Total Flights:</b> {flights.length}</p>
              <p><b>Valid Flights:</b> {validFlights.length}</p>
              <p><b>Avg Altitude:</b> {avgAltitude} m</p>
              <p><b>Last Updated:</b> {lastUpdated}</p>
            </>
          )}

          <hr />

          {/* 🔍 Search */}
          <h3>🔍 Search Location</h3>

          <input
            type="text"
            placeholder="Enter country or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              marginBottom: "8px"
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              width: "100%",
              padding: "6px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Search
          </button>

          <hr />

          {/* Controls */}
          <h3>🎛 Controls</h3>

          <label>
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={() => setShowHeatmap(!showHeatmap)}
            />
            Show Heatmap
          </label>

          <br /><br />

          <p>Intensity: {radius}</p>
          <input
            type="range"
            min="10"
            max="100"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />

          <hr />

          {/* Legend */}
          <h4>🌡 Heatmap Legend</h4>
          <div>
            🔵 Low <br />
            🟢 Medium <br />
            🟡 High <br />
            🔴 Very High
          </div>

          <hr />

          {/* Flight List */}
          <h3>✈ Flight List</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {flights.slice(0, 20).map((f, index) => (
              <li
                key={index}
                style={{
                  background: "#1f2937",
                  padding: "8px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#374151")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1f2937")
                }
              >
                ✈ <b>{f.flight_id}</b> <br />
                Alt: {f.altitude ? Math.round(f.altitude) : "N/A"} m
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Map */}
        <div style={{ flex: 1, height: "100%" }}>
          <MapContainer
            center={mapCenter}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <ChangeMapView center={mapCenter} />

            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Heatmap */}
            {showHeatmap && (
              <HeatmapLayer flights={flights} radius={radius} />
            )}

            {/* Markers */}
            {validFlights.map((f, index) => (
              <Marker key={index} position={[f.lat, f.lon]}>
                <Popup>
                  ✈ <b>{f.flight_id}</b><br />
                  Lat: {f.lat} <br />
                  Lon: {f.lon} <br />
                  Alt: {f.altitude ? Math.round(f.altitude) : "N/A"} m
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}

export default App;

