import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (res.ok) {
        // SAVE THE REAL JWT TOKEN
        localStorage.setItem('adminToken', data.token);
        navigate('/admin-dashboard'); 
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '300px' }}>
        <h2>Govt. Admin Portal</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input required type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px' }} />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', background: '#1e293b', color: 'white', border: 'none', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    </div>
  );
}