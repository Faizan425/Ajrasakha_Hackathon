// client/src/pages/MapPage.tsx
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { INDIA_STATES, type StateInfo } from "../data/indiaStates";
import StatePanel from "../components/StatePanel";
import MapController from "../components/MapController";
import RegionMarkers from "../components/RegionMarkers"; // <--- We use the REAL markers
import RegionPanel from "../components/RegionPanel";
import type { Region } from "../types";

export default function MapPage() {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}> {/* Subtract Navbar height */}
      
      {/* LEFT: THE MAP */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[22.5, 78.9]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <MapController selectedState={selectedState} />
          
          {/* SHOW THE DOTS FROM DATABASE */}
          <RegionMarkers onSelect={setSelectedRegion} />
          
        </MapContainer>
      </div>

      {/* RIGHT: CONTROL PANEL */}
      <div style={{ display: "flex", flexDirection: "column", width: "300px", borderLeft: "2px solid #ddd" }}>
        
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