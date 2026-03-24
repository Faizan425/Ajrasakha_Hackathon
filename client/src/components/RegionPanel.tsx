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
        cause: `Latest NDVI score is ${health.latestNDVI}`,
        prediction: `Current status is ${health.status}`
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
      <h3>{health.regionName}</h3>
      
      <div className="region-stats">
        <p><strong>Latest NDVI:</strong> {health.latestNDVI}</p>
        <p><strong>Status:</strong> <span className={`status ${health.status?.toLowerCase() || 'healthy'}`}>{health.status}</span></p>
      </div>

      <button 
        className="ai-btn"
        onClick={handleAiAnalysis}
        disabled={isLoadingAi}
      >
        {isLoadingAi ? " Analyzing..." : " GenAI Analysis"}
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
