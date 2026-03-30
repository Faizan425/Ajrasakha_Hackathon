import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend
} from "recharts";

export default function TrendAnalysis() {
  const { id } = useParams();
  const formatAnalysis = (text: string) => {
  return text
    .replace(/\*\*/g, "") // remove **
    .split(/\d+\.\s/)     // split by 1. 2. 3.
    .filter(item => item.trim() !== "");
};

  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`http://localhost:5000/api/regions/${id}/health`);
      const data = await res.json();

      const formatted = data.history.slice(-10).map((item:any) => ({
        date: new Date(item.date).toLocaleDateString(),
        ndvi: item.ndvi
      }));

      setHistory(formatted);

      // AI call
      const aiRes = await fetch("http://localhost:5000/api/trend-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ history: data.history.slice(-10) })
      });

      const aiData = await aiRes.json();
      setAnalysis(aiData.analysis);
    };

    loadData();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📈 Crop Health Trend</h1>

      <LineChart width={700} height={300} data={history}>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ndvi" />
      </LineChart>

      <div style={{ marginTop: "20px" }}>
        <h2>🤖 AI Analysis</h2>
      <div style={{ marginTop: "20px" }}>
  <h2>🤖 AI Crop Insight</h2>

  {formatAnalysis(analysis).map((point, index) => (
    <div
      key={index}
      style={{
        background: "#f8fafc",
        padding: "12px",
        marginBottom: "10px",
        borderRadius: "8px",
        borderLeft: "4px solid #16a34a"
      }}
    >
      {/* <strong>Point {index + 1}</strong> */}
      <p style={{ margin: "5px 0" }}>{point.trim()}</p>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}