import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/adminDashboard.css";

interface Farmer {
  name: string;
  email: string;
  location: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [alertForm, setAlertForm] = useState({ crop: 'Rice', type: 'Health', severity: 'high', message: '', action: '' ,location:'Godavari Basin (Andhra Pradesh)'});
  const [insightForm, setInsightForm] = useState({ title: '', cause: '', prediction: '', tags: '', difficulty: 'Easy Fix' });
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [showFarmers, setShowFarmers] = useState(false);

  // Kick them out if they don't have a token
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    // Convert comma-separated string into an array
    const formattedData = {
      ...insightForm,
      tags: insightForm.tags.split(',').map(tag => tag.trim())
    };

    try {
      const res = await fetch('http://localhost:5000/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formattedData)
      });
      if (res.ok) {
        alert('✨ Insight Published!');
        setInsightForm({ title: '', cause: '', prediction: '', tags: '', difficulty: 'Easy Fix' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRaiseAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- SENDING THE JWT SECURELY
        },
        body: JSON.stringify({
        ...alertForm,
        date: new Date().toLocaleString(),
        status: "active"
      })
    });

      if (res.ok) {
        alert('🚨 Alert Broadcasted Successfully to all user dashboards!');
        setAlertForm({ ...alertForm, message: '', action: '' });
      } else {
        alert('Failed to authorize. Token may be expired.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const fetchFarmers = async () => {

  if (showFarmers) {
    setShowFarmers(false);
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/farmers");
    const data = await res.json();
    setFarmers(data);
    setShowFarmers(true);
  } catch (err) {
    console.error("Error fetching farmers:", err);
  }
};

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1 style={{ color: '#c62828' }}>Control Center: Alert Broadcasting</h1>
        <button onClick={logout} className="logout-btn">Log Out</button>
      </div>

      <div className="admin-panel">
        <h3>Create New Regional Alert</h3>
        <form onSubmit={handleRaiseAlert} className="admin-form">
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {/* Target Crop */}
            <div style={{ flex: 1 }}>
              <label>Target Crop</label>
              <select
                value={alertForm.crop}
                onChange={e => setAlertForm({ ...alertForm, crop: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              >
                <option>Rice</option>
                <option>Wheat</option>
                <option>Cotton</option>
              </select>
            </div>

            {/* Severity */}
            <div style={{ flex: 1 }}>
              <label>Severity Level</label>
              <select
                value={alertForm.severity}
                onChange={e => setAlertForm({ ...alertForm, severity: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              >
                <option value="high">High (Red)</option>
                <option value="medium">Medium (Orange)</option>
                <option value="low">Low (Yellow)</option>
              </select>
            </div>

            {/* Location */}
            <div style={{ flex: 1 }}>
              <label>Location</label>
              <select
                value={alertForm.location}
                onChange={e => setAlertForm({ ...alertForm, location: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px' }}
              >
                <option value="">Select Region</option>
                <option value="Ludhiana Fields (Punjab)">Ludhiana Fields (Punjab)</option>
                <option value="Godavari Basin (Andhra Pradesh)">Godavari Basin (Andhra Pradesh)</option>
                <option value="Dharwad Farms (Karnataka)">Dharwad Farms (Karnataka)</option>
                <option value="Palakkad Gap (Kerala)">Palakkad Gap (Kerala)</option>
                <option value="Thanjavur Rice Belt (Tamil Nadu)">Thanjavur Rice Belt (Tamil Nadu)</option>
              </select>
            </div>
        </div>

          <div>
            <label>Alert Message (What is the issue?)</label>
            <input required value={alertForm.message} onChange={e => setAlertForm({...alertForm, message: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label>Recommended Action</label>
            <input required value={alertForm.action} onChange={e => setAlertForm({...alertForm, action: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" className="alert-btn">
            BROADCAST ALERT
          </button>
        </form>
      </div>
      {/* INSIGHTS CREATION PANEL */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginTop: '20px', borderTop: '4px solid #2e7d32' }}>
        <h3 style={{ color: '#2e7d32', marginTop: 0 }}>🧠 Create Smart Insight</h3>
        <form onSubmit={handleCreateInsight} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input required placeholder="Title (e.g., Why is my Rice turning yellow?)" value={insightForm.title} onChange={e => setInsightForm({...insightForm, title: e.target.value})} style={{ padding: '10px' }} />
          <textarea required placeholder="Cause..." value={insightForm.cause} onChange={e => setInsightForm({...insightForm, cause: e.target.value})} style={{ padding: '10px', height: '60px' }} />
          <textarea required placeholder="Prediction (What happens next?)..." value={insightForm.prediction} onChange={e => setInsightForm({...insightForm, prediction: e.target.value})} style={{ padding: '10px', height: '60px' }} />
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <input required placeholder="Tags (comma separated, e.g., Weather, Soil)" value={insightForm.tags} onChange={e => setInsightForm({...insightForm, tags: e.target.value})} style={{ flex: 2, padding: '10px' }} />
            <select value={insightForm.difficulty} onChange={e => setInsightForm({...insightForm, difficulty: e.target.value})} style={{ flex: 1, padding: '10px' }}>
              <option>Easy Fix</option><option>Moderate</option><option>Preventative</option><option>Critical</option>
            </select>
          </div>
          <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '15px', cursor: 'pointer' }}>Publish Insight</button>
        </form>
      </div>
      
  {/* SHOW FARMERS BUTTON */}
<div style={{ marginTop: "20px" }}>
  <button onClick={fetchFarmers} className="show-farmers-btn">
    {showFarmers ? "Hide Farmers" : "🌾 Show Registered Farmers"}
  </button>
</div>

{/* FARMERS TABLE */}
{showFarmers && (
  <div className="farmers-panel">

    <h3>Registered Farmers</h3>

    <div className="farmers-table-wrapper">

      <table className="farmers-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Region</th>
          </tr>
        </thead>

        <tbody>

          {farmers.length === 0 ? (
            <tr>
              <td colSpan={3}>No farmers registered</td>
            </tr>
          ) : (
            farmers.map((farmer, index) => (
              <tr key={index}>
                <td>{farmer.name}</td>
                <td>{farmer.email}</td>
                <td>{farmer.location}</td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>

  </div>
)}

</div>
);
} 