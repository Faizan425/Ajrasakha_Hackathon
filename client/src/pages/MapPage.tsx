// client/src/pages/MapPage.tsx
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapPage.css";

import { INDIA_STATES, type StateInfo } from "../data/indiaStates";
import StatePanel from "../components/StatePanel";
import MapController from "../components/MapController";
import RegionMarkers from "../components/RegionMarkers"; // <--- We use the REAL markers
import RegionPanel from "../components/RegionPanel";
import type { Region } from "../types";

export default function MapPage() {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  return (
    <div className="map-page-container">
      
      {/* LEFT: THE MAP */}
      <div className="map-container">
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