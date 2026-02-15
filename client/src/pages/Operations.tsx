// client/src/pages/Operations.tsx
import React, { useState } from 'react';

const Operations: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<{ runTime: string, message: string } | null>(null);

  const runPipeline = async () => {
    setStatus('RUNNING');
    setLogs(["Initializing Satellite Link...", "Authenticating with Sentinel-2 API...", "Requesting imagery..."]);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/run-pipeline', {
        method: 'POST'
      });
      const data = await res.json();

      if (data.status === "Success") {
        setLogs(prev => [...prev, "Data Received.", "Processing NDVI...", "Updating Database...", "DONE."]);
        setStatus('SUCCESS');
        setResult(data);
      } else {
        throw new Error("Pipeline Failed");
      }
    } catch (err) {
      setStatus('ERROR');
      setLogs(prev => [...prev, "❌ CONNECTION FAILED", "Retrying..."]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>📡 Satellite Operations Center</h1>
        <p>Manually trigger a data refresh cycle for all registered regions.</p>

        {/* THE BIG RED BUTTON */}
        <button 
          onClick={runPipeline} 
          disabled={status === 'RUNNING'}
          style={{
            ...styles.button,
            backgroundColor: status === 'RUNNING' ? '#ccc' : '#e53935',
            cursor: status === 'RUNNING' ? 'not-allowed' : 'pointer'
          }}
        >
          {status === 'RUNNING' ? 'PIPELINE RUNNING...' : 'RUN PIPELINE'}
        </button>

        {/* TERMINAL OUTPUT */}
        <div style={styles.terminal}>
          <p style={{color: '#4caf50', margin: 0}}>$ system_status: ONLINE</p>
          {logs.map((log, i) => (
            <p key={i} style={{margin: '5px 0', fontFamily: 'monospace'}}>{`> ${log}`}</p>
          ))}
          
          {status === 'SUCCESS' && result && (
            <div style={styles.resultBox}>
              <p><strong>STATUS:</strong> {result.status}</p>
              <p><strong>TIME:</strong> {result.runTime}</p>
              <p><strong>DETAILS:</strong> {result.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Styles for this page
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    background: '#f4f6f8',
    minHeight: '80vh'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center'
  },
  header: {
    color: '#1e293b',
    marginBottom: '10px'
  },
  button: {
    marginTop: '30px',
    padding: '20px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'transform 0.1s',
    boxShadow: '0 4px 0 #b71c1c'
  },
  terminal: {
    marginTop: '40px',
    background: '#1e1e1e',
    color: '#00e676',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'left',
    minHeight: '200px',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: '0.9rem'
  },
  resultBox: {
    marginTop: '20px',
    borderTop: '1px solid #333',
    paddingTop: '10px',
    color: '#fff'
  }
};

export default Operations;