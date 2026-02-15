import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import '../../styles/Cards.css';

const TrendComparisonCard = ({ cropName }: { cropName: string }) => {
  // Mock history data
  const data = [
    { period: 'Last Year', value: 0.65 },
    { period: 'Last Month', value: 0.72 },
    { period: 'Last Week', value: 0.78 },
    { period: 'Current', value: 0.82 },
  ];

  return (
    <div className="card trend-card">
      <h3>📈 {cropName} Growth Trend</h3>
      <div className="chart-container" style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="period" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 1]} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {/* CHANGE: Replaced 'entry' with '_' */}
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={index === 3 ? '#2e7d32' : '#82ca9d'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card-info">
        <p>Growth is <strong>8% higher</strong> than last month.</p>
        <p>Prediction: <strong>Peak harvest in 14 days.</strong></p>
      </div>
    </div>
  );
};

export default TrendComparisonCard;