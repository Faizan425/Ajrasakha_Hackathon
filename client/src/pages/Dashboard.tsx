import React, { useState, useEffect } from 'react';
import CropSelector from '../components/CropSelector';
import SwipeableCards from '../components/SwipeableCards';
import '../styles/Dashboard.css';

// Define the shape of data we expect from the API
interface DashboardData {
  healthScore: number;
  ndvi: number;
  ndwiScore: number;
  status: string;
  trend: string;
  weeklyChange: string;
}

const Dashboard: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Rice');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. First, get all regions to find which one grows the selected crop
        const regionsRes = await fetch('http://localhost:5000/api/regions');
        const regions = await regionsRes.json();
        
        // Find the region ID that matches the selected crop (e.g., find the "Rice" region)
        // const matchedRegion = regions.find((r: any) => r.cropType === selectedCrop);
        const matchedRegion = regions.find((r: any) => 
          r.cropType.toLowerCase() === selectedCrop.toLowerCase()
          );

        if (matchedRegion) {
          // 2. Fetch the health stats for that specific Region ID
          const dataRes = await fetch(`http://localhost:5000/api/regions/${matchedRegion._id}/data`);
          const cropData = await dataRes.json();
          
          // Map backend "metrics" object to what the UI expects
          if (cropData && cropData.metrics) {
            console.log("BACKEND SAYS:", cropData);
            setData(cropData.metrics);
          }
        } else {
          // Fallback if no region exists for this crop in DB
          console.warn(`No region found for ${selectedCrop}`);
          setData(null);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCrop]); // Re-run this whenever user picks a new crop

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>CropCare Advisor</h1>
        <p>Satellite-based health monitoring</p>
      </header>
      
      <CropSelector 
        selected={selectedCrop} 
        onSelect={(crop) => setSelectedCrop(crop)} 
      />
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '20px', color: 'white'}}>
          Scanning Satellite Data... 📡
        </div>
      ) : data ? (
        <SwipeableCards data={data} cropName={selectedCrop} />
      ) : (
        <div style={{textAlign: 'center', padding: '20px', color: '#ccc'}}>
          No sensor data available for {selectedCrop}.
        </div>
      )}
    </div>
  );
};

export default Dashboard;