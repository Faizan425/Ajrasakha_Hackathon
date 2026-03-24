// client/src/pages/MapPage.tsx
import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapPage.css";

import { INDIA_STATES, type StateInfo } from "../data/indiaStates";
import StatePanel from "../components/StatePanel";
import MapController from "../components/MapController";
import RegionMarkers from "../components/RegionMarkers";
import RegionPanel from "../components/RegionPanel";
import type { Region } from "../types";
import { api } from "../services/api";

export default function MapPage() {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    api.get("/regions").then((res) => setRegions(res.data));
  }, []);

  const totalDistricts = regions.length;
  const criticalCount = regions.filter((r) => r.status === "Critical").length;
  const avgNdvi = regions.length 
    ? (regions.reduce((acc, r) => acc + (r.latestNDVI || 0), 0) / regions.length).toFixed(2)
    : "0.00";

  return (
    <div className="map-page-container">
      
      {/* LEFT: THE MAP */}
      <div className="map-container">
        <div className="map-summary-container">
          <div className="summary-card">
            <span className="label">Regions</span>
            <span className="value">{totalDistricts}</span>
          </div>
          <div className="summary-card critical">
            <span className="label">Critical</span>
            <span className="value">{criticalCount}</span>
          </div>
          <div className="summary-card healthy">
            <span className="label">Avg NDVI</span>
            <span className="value">{avgNdvi}</span>
          </div>
        </div>

        {/* SATELLITE TOGGLE BUTTON */}
        <button 
          className="map-toggle-btn"
          onClick={() => setIsSatellite(!isSatellite)}
        >
          {isSatellite ? "🗺️ Standard View" : "🛰️ Satellite View"}
        </button>

        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={isSatellite 
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={isSatellite
              ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              : "&copy; OpenStreetMap contributors"
            }
          />

          <MapController selectedState={selectedState} />
          
          {/* SHOW THE DOTS FROM DATABASE */}
          <RegionMarkers onSelect={setSelectedRegion} />
          
        </MapContainer>
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div className="control-panel-container">
        
        {/* Top: State Selector */}
        <div style={{ height: "50%", overflowY: "auto", borderBottom: "1px solid #ddd" }}>
          <StatePanel
            states={INDIA_STATES}
            onSelect={setSelectedState}
          />
        </div>

        {/* Bottom: Region Details (Shows when you click a dot) */}
        <div style={{ padding: "20px", background: "#f9f9f9", flex: 1 }}>
          <h3>Region Details</h3>
          {selectedRegion ? (
            <RegionPanel region={selectedRegion} />
          ) : (
            <p style={{color: "#666"}}>Click a marker on the map to see live crop health.</p>
          )}
        </div>

      </div>
    </div>
  );
}