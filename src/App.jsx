import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const flights = [
  { id: 1, lat: 12.9716, lon: 77.5946, name: "Flight BLR" },
  { id: 2, lat: 28.6139, lon: 77.2090, name: "Flight DEL" },
  { id: 3, lat: 19.0760, lon: 72.8777, name: "Flight BOM" }
];

function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ background: "#1f2937", color: "white", padding: "10px", textAlign: "center" }}>
        🌍 Global Flight Traffic Heatmap
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        
        {/* Sidebar */}
        <div style={{ width: "250px", background: "#f3f4f6", padding: "10px" }}>
          <h3>Flight Info</h3>
          <p>Dummy data for Sprint 1</p>
          <ul>
            {flights.map(f => (
              <li key={f.id}>{f.name}</li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%" }}>
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {flights.map((flight) => (
              <Marker key={flight.id} position={[flight.lat, flight.lon]}>
                <Popup>{flight.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}

export default App;