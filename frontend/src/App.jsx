import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet.heat";

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
      radius: Number(radius),
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
    return () => { map.removeLayer(heatLayer); };
  }, [flights, map, radius]);

  return null;
}

// Only fires when center prop changes — won't interrupt user panning/zooming
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 5);
  }, [center, map]);
  return null;
}

// Markers render only at zoom >= 6 to avoid performance issues
function ZoomAwareMarkers({ validFlights }) {
  const [zoom, setZoom] = useState(5);

  useMapEvent("zoomend", (e) => {
    setZoom(e.target.getZoom());
  });

  if (zoom < 6) return null;

  return validFlights.map(f => (
    <Marker key={f.flight_id} position={[f.lat, f.lon]}>
      <Popup>
        ✈ <b>{f.flight_id}</b><br />
        Lat: {f.lat}<br />
        Lon: {f.lon}<br />
        Alt: {f.altitude ? Math.round(f.altitude) : "N/A"} m
      </Popup>
    </Marker>
  ));
}

function App() {
  const [flights, setFlights] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [radius, setRadius] = useState(50);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);

  // MOBILE: controls the bottom drawer open/close state
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setError(null);
        const response = await fetch("https://flight-backend-q6am.onrender.com/flights");
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const data = await response.json();
        setFlights(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Failed to load flight data. Retrying...");
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  const validFlights = useMemo(
    () => flights.filter(f => f.lat && f.lon),
    [flights]
  );

  const avgAltitude = useMemo(() => {
    if (flights.length === 0) return 0;
    return Math.round(
      flights.reduce((sum, f) => sum + (f.altitude || 0), 0) / flights.length
    );
  }, [flights]);

  const handleSearch = async () => {
    if (!search) return;
    setSearchError("");

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setDrawerOpen(false); // close drawer after navigating on mobile
      } else {
        setSearchError("Location not found. Try a different name.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Search failed. Please try again.");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="app-wrapper">

      <div className="header">
        🌍 Global Flight Traffic Heatmap
      </div>

      <div className="main-layout">

        {/* MOBILE: dim overlay — closes drawer on tap */}
        <div
          className={`drawer-overlay${drawerOpen ? " visible" : ""}`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Sidebar / bottom drawer */}
        <div className={`sidebar${drawerOpen ? " drawer-open" : ""}`}>
          <h3>📊 Flight Info</h3>

          {error && <p style={{ color: "#f87171" }}>{error}</p>}

          {flights.length === 0 && !error ? (
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

          <h3>🔍 Search Location</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Enter country or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          {searchError && <p className="search-error">{searchError}</p>}

          <hr />

          <h3>🎛 Controls</h3>
          <label className="controls-label">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={() => setShowHeatmap(prev => !prev)}
            />
            Show Heatmap
          </label>

          <br /><br />
          <p>Intensity: {radius}</p>
          <input
            type="range"
            className="radius-slider"
            min="10"
            max="100"
            step="1"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />

          <hr />

          <h4>🌡 Heatmap Legend</h4>
          <div className="legend">
            🔵 Low<br />
            🟢 Medium<br />
            🟡 High<br />
            🔴 Very High
          </div>

          <hr />

          <h3>✈ Flight List</h3>
          <ul className="flight-list">
            {flights.slice(0, 20).map((f) => (
              <li key={f.flight_id} className="flight-item">
                ✈ <b>{f.flight_id}</b><br />
                Alt: {f.altitude ? Math.round(f.altitude) : "N/A"} m
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="map-container">
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

            {showHeatmap && (
              <HeatmapLayer flights={flights} radius={radius} />
            )}

            <ZoomAwareMarkers validFlights={validFlights} />
          </MapContainer>
        </div>

        {/* MOBILE: floating button to toggle the drawer */}
        <button
          className={`drawer-toggle${drawerOpen ? " drawer-open" : ""}`}
          onClick={() => setDrawerOpen(prev => !prev)}
          aria-label={drawerOpen ? "Close panel" : "Open panel"}
        >
          {drawerOpen ? "✕ Close" : "☰ Flight Info"}
        </button>

      </div>
    </div>
  );
}

export default App;
