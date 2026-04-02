import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Region, RegionHealth } from "../types";
import "../styles/RegionPanel.css";

interface Props {
  region: Region | null;
}

export default function RegionPanel({ region }: Props) {
  const [health, setHealth] = useState<RegionHealth | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    setAiAnalysis(null);
    setIsLoadingAi(false);

    if (!region) return;

    api.get(`/regions/${region._id}/health`)
      .then(res => setHealth(res.data));
  }, [region]);

  const handleAiAnalysis = async () => {
    if (!health) return;
    setIsLoadingAi(true);
    try {
      const response = await api.post('/analyze', {
        title: `Crop Health in ${health.regionName}`,
        cause: `Region: ${health.regionName}
        Crop Type: ${health.cropType}
        Latest NDVI: ${health.latestNDVI.toFixed(2)}
        NDWI (Water Stress): ${health.ndwiScore.toFixed(2)}
        Recent Trend: ${health.trend}`,
        prediction: `Current status is ${health.status} with a health score of ${health.healthScore}/100.`
      });
      setAiAnalysis(response.data.analysis);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setAiAnalysis("Failed to load AI analysis. Ensure backend is running and Gemini API key is configured.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  if (!region) return <div className="region-panel">Select a marker on the map to see live crop health.</div>;
  if (!health) return <div className="region-panel">Loading live sensor data...</div>;

  return (
    <div className="region-panel">
      <div className="panel-header">
        <h3>{health.regionName}</h3>
        <span className="crop-tag">{health.cropType}</span>
      </div>
      
      <div className="region-stats-grid">
        <div className="stat-box">
          <span className="label">NDVI</span>
          <span className="value">{health.latestNDVI.toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <span className="label">Health</span>
          <span className="value">{health.healthScore}%</span>
        </div>
        <div className="stat-box">
          <span className="label">Trend</span>
          <span className={`value trend-${health.trend}`}>{health.trend}</span>
        </div>
        <div className="stat-box">
          <span className="label">Moisture</span>
          <span className="value">{health.ndwiScore.toFixed(2)}</span>
        </div>
      </div>

      <div className="status-indicator">
        <strong>Status:</strong> 
        <span className={`status ${health.status?.toLowerCase() || 'healthy'}`}>
          {health.status}
        </span>
      </div>

      <button 
        className="ai-btn"
        onClick={handleAiAnalysis}
        disabled={isLoadingAi}
      >
        {isLoadingAi ? "⏳ Processing Data..." : "🤖 GenAI Health Analysis"}
      </button>

      {aiAnalysis && (
        <div className="ai-result">
          <h4>AI Action Plan</h4>
          <p>{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
}
