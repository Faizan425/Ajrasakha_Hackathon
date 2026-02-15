import React from 'react';
import '../styles/Insights.css';

const InsightsPage: React.FC = () => {
  const insights = [
    {
      id: 1,
      title: "Why is my Rice turning yellow?",
      cause: "Low NDVI detected in sector B. This is likely due to nitrogen leaching after the heavy rains last Tuesday.",
      prediction: "If untreated, yield could drop by 12%. However, applying urea now will recover 90% of growth within 7 days.",
      tags: ["Nutrients", "Recovery"],
      difficulty: "Easy Fix"
    },
    {
      id: 2,
      title: "Weather Outlook: Heatwave Warning",
      cause: "Satellite thermal bands show soil temperature rising 4°C above average while NDWI (moisture) is dropping.",
      prediction: "Expect high transpiration rates. Your Wheat will need 20% more water over the next 3 days to avoid wilting.",
      tags: ["Weather", "Irrigation"],
      difficulty: "Preventative"
    }
  ];

  return (
    <div className="insights-page">
      <header className="insights-header">
        <h1>Smart Insights</h1>
        <p>Expert analysis of your field data</p>
      </header>

      <div className="insights-grid">
        {insights.map(item => (
          <div key={item.id} className="insight-card">
            <div className="insight-tags">
              {item.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              <span className="difficulty">{item.difficulty}</span>
            </div>
            
            <h2>{item.title}</h2>
            
            <section className="insight-section">
              <h3>🔍 Cause</h3>
              <p>{item.cause}</p>
            </section>

            <section className="insight-section next-steps">
              <h3>🔮 What Happens Next?</h3>
              <p>{item.prediction}</p>
            </section>

            <button className="learn-more-btn">Read Deep Analysis</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPage;