import React, { useState, useEffect } from 'react';
import '../styles/Alerts.css';

// Define the Alert Interface
interface Alert {
  _id: string; // MongoDB uses _id, not id
  crop: string;
  type: string;
  severity: string;
  message: string;
  action: string;
  date: string;
  status: 'active' | 'completed';
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [loading, setLoading] = useState(true);

  // FETCH ALERTS FROM API
  useEffect(() => {
    fetch('http://localhost:5000/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching alerts:", err));
  }, []);

  // LOCAL TOGGLE (Ideally you would also send a POST request to backend to save this change)
  const toggleStatus = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert._id === id 
        ? { ...alert, status: alert.status === 'active' ? 'completed' : 'active' } 
        : alert
    ));
  };

  const filteredAlerts = alerts.filter(a => a.status === filter);

  return (
    <div className="alerts-page">
      <header className="alerts-header">
        <h1>Risk Center</h1>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({alerts.filter(a => a.status === 'active').length})
        </button>
        <button 
          className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          History ({alerts.filter(a => a.status === 'completed').length})
        </button>
      </div>

      <div className="alerts-list">
        {loading ? (
           <p style={{textAlign: 'center', color: '#888'}}>Loading Alerts...</p>
        ) : filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <p>No {filter} alerts found. 🌾</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            // Note: Using alert._id here
            <div key={alert._id} className={`alert-item ${alert.severity} ${alert.status}`}>
              <div className="alert-icon-section">
                <span className="severity-dot"></span>
                <div className="alert-meta">
                  <h3>{alert.crop}</h3>
                  <span className="alert-time">{alert.date}</span>
                </div>
              </div>
              
              <p className="alert-message"><strong>{alert.type}:</strong> {alert.message}</p>
              
              {alert.status === 'active' && (
                <div className="alert-action-box">
                   <strong>Fix:</strong> {alert.action}
                </div>
              )}

              <div className="alert-footer">
                <button 
                  className="status-toggle-btn"
                  onClick={() => toggleStatus(alert._id)}
                >
                  {alert.status === 'active' ? 'Mark as Resolved' : 'Re-open Alert'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPage;