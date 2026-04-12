# 🌍 Global Flight Traffic Heatmap

An interactive web-based system that visualizes **real-time global flight movements** using geospatial data and dynamic heatmap visualization.

---

## 🚀 Project Overview

The **Global Flight Traffic Heatmap** is designed to track and display live aircraft positions across the world.
It integrates real-time aviation data, processes geospatial coordinates, and presents them on an interactive map with heatmap density visualization.

This project follows **Agile Scrum methodology** and is developed in multiple sprints.

---

## ✨ Features

* 🌍 Interactive world map using Leaflet
* 🔥 Real-time heatmap visualization of flight density
* ✈️ Flight markers with detailed information
* 🔍 Location-based search (zoom to any country/city)
* 📊 Live flight statistics (total flights, altitude, etc.)
* 🎛️ User controls (toggle heatmap, adjust intensity)
* ⏱️ Auto-refresh of live data (every 30 seconds)
* 📱 Responsive and clean UI dashboard

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* React Leaflet
* Leaflet Heatmap

### Backend

* FastAPI (Python)
* OpenSky Network API

### ORM
* SQLAlchemy

### Database

* PostgreSQL with PostGIS
* Supabase (Cloud Database)

### Tools

* Git & GitHub
* Docker (Environment setup)
* VS Code

---

## ⚙️ System Architecture

Frontend → Backend API → Database → External Flight API

* Frontend fetches flight data from backend
* Backend retrieves data from OpenSky API
* Data is validated, processed, and stored
* Visualization is updated dynamically

---

## 📂 Project Structure

```
global-traffic-heatmap/
│
├── frontend/        # React application
├── backend/         # FastAPI server
├── database/        # PostgreSQL schema
├── docs/            # Reports & documentation
└── README.md
```

---

## 🔧 Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/global-traffic-heatmap.git
cd global-traffic-heatmap
```

---

### 2. Backend Setup

```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

### 4. Open in Browser

```
http://localhost:5173
```

---

## 🔗 API Endpoint

```
GET /flights
```

Returns real-time flight data including:

* Flight ID
* Latitude & Longitude
* Altitude
* Timestamp

---

## 📊 Agile Development

* **Total Sprints:** 4
* **Total User Stories:** 18
* **Total Story Points:** 89

### Sprint Highlights

* Sprint 1: Environment setup & base architecture
* Sprint 2: Real-time data integration
* Sprint 3: Heatmap visualization & optimization
* Sprint 4: Deployment & documentation

---

## 👥 Team Members

* **Sivanand K** – Backend Development
* **Mohammed Iqlas** – Database & Cloud
* **Prathiush Jayaprakash** – Frontend Development

---

## ⚠️ Challenges Faced

* API data inconsistencies (missing coordinates)
* Database connectivity issues across systems
* UI layout and rendering optimizations
* Synchronizing frontend and backend data

---

## 📈 Future Enhancements

* 📍 Flight path tracking
* 📊 Advanced analytics dashboard
* 🌐 Global region-based filtering
* 🚀 Cloud deployment (AWS / GCP)
* 📱 Mobile responsiveness improvements

---

## 🎯 Conclusion

The project successfully demonstrates a **real-time geospatial data visualization system** using modern web technologies and Agile practices.

It provides an intuitive interface to understand global flight traffic patterns dynamically.

---

## 📜 License

This project is developed for academic purposes.

---

## ⭐ Acknowledgements

* OpenSky Network API
* OpenStreetMap
* Leaflet.js

---
