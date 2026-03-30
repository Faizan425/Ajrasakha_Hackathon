// import React, { useState, useEffect } from 'react';
// import CropSelector from '../components/CropSelector';
// import SwipeableCards from '../components/SwipeableCards';
// import '../styles/Dashboard.css';

// // Define the shape of data we expect from the API
// interface DashboardData {
//   healthScore: number;
//   ndvi: number;
//   ndwiScore: number;
//   status: string;
//   trend: string;
//   weeklyChange: string;
// }

// const Dashboard: React.FC = () => {
//   const [selectedCrop, setSelectedCrop] = useState<string>('Rice');
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. First, get all regions to find which one grows the selected crop
//         const regionsRes = await fetch('http://localhost:5000/api/regions');
//         const regions = await regionsRes.json();
        
//         // Find the region ID that matches the selected crop (e.g., find the "Rice" region)
//         // const matchedRegion = regions.find((r: any) => r.cropType === selectedCrop);
//         const matchedRegion = regions.find((r: any) => 
//           r.cropType.toLowerCase() === selectedCrop.toLowerCase()
//           );

//         if (matchedRegion) {
//           // 2. Fetch the health stats for that specific Region ID
//           const dataRes = await fetch(`http://localhost:5000/api/regions/${matchedRegion._id}/data`);
//           console.log(dataRes)
//           const cropData = await dataRes.json();
//           console.log(cropData)
//           // Map backend "metrics" object to what the UI expects
//           if (cropData && cropData.metrics) {
//             console.log("BACKEND SAYS:", cropData);
//             setData(cropData.metrics);
//           }
//         } else {
//           // Fallback if no region exists for this crop in DB
//           console.warn(`No region found for ${selectedCrop}`);
//           setData(null);
//         }
//       } catch (err) {
//         console.error("Failed to fetch dashboard data:", err);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [selectedCrop]); // Re-run this whenever user picks a new crop

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <h1>CropCare Advisor</h1>
//         <p>Satellite-based health monitoring</p>
//       </header>
      
//       <CropSelector 
//         selected={selectedCrop} 
//         onSelect={(crop) => setSelectedCrop(crop)} 
//       />
      
//       {loading ? (
//         <div style={{textAlign: 'center', padding: '20px', color: 'white'}}>
//           Scanning Satellite Data... 📡
//         </div>
//       ) : data ? (
//         <SwipeableCards data={data} cropName={selectedCrop} />
//       ) : (
//         <div style={{textAlign: 'center', padding: '20px', color: '#ccc'}}>
//           No sensor data available for {selectedCrop}.
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import CropSelector from '../components/CropSelector';
import SwipeableCards from '../components/SwipeableCards';
import '../styles/Dashboard.css';
import WeatherCard from '../components/WeatherCard';
import Papa from "papaparse";


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

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Fetch all regions
//         const regionsRes = await fetch('http://localhost:5000/api/regions');
//         const regions = await regionsRes.json();
        
//         // 2. Find the region ID that matches the selected crop
//         const matchedRegion = regions.find((r: any) => 
//           r.cropType.toLowerCase() === selectedCrop.toLowerCase()
//         );
//         console.log(matchedRegion);
//         if (matchedRegion) {
//           // 3. ZERO-LATENCY MAPPING: 
//           // We already have the data! Just shape it for the SwipeableCards.
//           const mappedData: DashboardData = {
//             ndvi: matchedRegion.latestNDVI || 0,
//             healthScore: matchedRegion.latestNDVI || 0, 
//             // Calculate a mock NDWI (moisture) based on NDVI for the water card
//             ndwiScore: matchedRegion.latestNDVI ? parseFloat((matchedRegion.latestNDVI * 0.8).toFixed(2)) : 0.45,
//             status: matchedRegion.status || "Unknown",
//             trend: matchedRegion.trend || "stable",
//             // Generate a dynamic percentage string based on the trend
//             weeklyChange: matchedRegion.trend === "improving" ? "+5.2%" : (matchedRegion.trend === "declining" ? "-3.1%" : "0%")
//           };
//           console.log(mappedData);
//           setData(mappedData);

// //offline storage
//             localStorage.setItem("dashboardData", JSON.stringify(mappedData));
//         } else {
//           console.warn(`No region found for ${selectedCrop}`);
//           setData(null);
//         }
//       } catch (err) {
//         console.error("Failed to fetch dashboard data:", err);
//         //to load offline data
//         const saved = localStorage.getItem("dashboardData");
//   if (saved) {
//     setData(JSON.parse(saved));
//   }
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, [selectedCrop]);
useEffect(() => {
  const fetchNDVI = async () => {
    setLoading(true);

    try {
      // Map crops to polygon IDs (use same for now if needed)
      const cropPolygonMap: any = {
        Rice: "POLY_TN",
        Wheat: "POLY_AP",
        Cotton: "POLY_KA"
      };

      const polygon = cropPolygonMap[selectedCrop];

      // Correct API call (FIXED appid)
      const res = await fetch(
        `https://api.agromonitoring.com/agro/1.0/ndvi/history?polyid=${polygon}&appid=${process.env.REACT_APP_AGRO_API_KEY}`
      );

      const result = await res.json();

      console.log("🌱 AGRO DATA:", result);
      console.log("Selected Crop:", selectedCrop);
      console.log("Polygon:", polygon);

      if (result && result.length > 0) {
        const latest = result[result.length - 1];

        // FIXED NDVI extraction
        //const ndvi = latest.data?.mean || 0;
        const baseNDVI = latest.data?.mean || 0;

// add variation per crop
const variationMap: any = {
  Rice: 0.05,
  Wheat: -0.03,
  Cotton: 0.08,
  Corn: 0.02,
  Soybean: -0.01
};

const ndvi = Math.max(0, Math.min(1, baseNDVI + (variationMap[selectedCrop] || 0)));

        const mappedData: DashboardData = {
          ndvi: ndvi,
          healthScore: ndvi,
          ndwiScore: parseFloat((ndvi * 0.8).toFixed(2)),
          status:
            ndvi > 0.6
              ? "Good"
              : ndvi > 0.3
              ? "Moderate"
              : "Poor",
          trend: "stable",
          weeklyChange: "0%"
        };

        setData(mappedData);

        // ✅ Save for offline
        localStorage.setItem("dashboardData", JSON.stringify(mappedData));
      } else {
        console.warn("No NDVI data found");
        setData(null);
      }

    } catch (err) {
      console.error("❌ Agro API error:", err);

      // ✅ Offline fallback
      const saved = localStorage.getItem("dashboardData");
      if (saved) {
        setData(JSON.parse(saved));
      }
    }

    setLoading(false);
  };

  fetchNDVI();
}, [selectedCrop]);
   {console.log("SELECTED CROP:", selectedCrop)}
  //for csv
 const downloadAllCSV = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/regions");
    const regions = await res.json();

    const csvData = await Promise.all(
      regions.map(async (region: any) => {
        let weatherText = "N/A";

        // Fetch weather safely
        if (region.coordinates?.lat && region.coordinates?.lng) {
          try {
            const weatherRes = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${region.coordinates.lat}&lon=${region.coordinates.lng}&appid=68f4118907ed0202d1a37608bcdf4055&units=metric`
            );

            const weatherData = await weatherRes.json();

            if (weatherData?.main && weatherData?.weather?.length > 0) {
              weatherText = `${weatherData.main.temp.toFixed(1)}°C, ${weatherData.weather[0].description}`;
            }
          } catch (err) {
            console.warn("Weather fetch failed for:", region.cropType);
          }
        }

        return {
          Crop: region.cropType || "N/A",
          NDVI: (region.latestNDVI || 0).toFixed(2),
          NDWI: region.latestNDVI
            ? (region.latestNDVI * 0.8).toFixed(2)
            : "0.45",
          Status:
            region.latestNDVI > 0.6
              ? "Good"
              : region.latestNDVI > 0.3
              ? "Moderate"
              : "Poor",
          Trend: region.trend || "stable",
          Weather: weatherText,
          Date: new Date().toLocaleDateString()
        };
      })
    );

    // Convert to CSV
    const csv = Papa.unparse(csvData);

    // Download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "all_crops_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error("CSV export failed:", err);
  }
};
//for csv file
// const downloadAllCSV = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/regions");
//     const regions = await res.json();

//     const csvData = regions.map((region: any) => ({
//       Crop: region.cropType,
//       NDVI: (region.latestNDVI || 0).toFixed(2),
//       NDWI: region.latestNDVI
//         ? (region.latestNDVI * 0.8).toFixed(2)
//         : "0.45",
//       Status: region.status || "Unknown",
//       Trend: region.trend || "stable",
//       Weather: "28°C Clear", // demo weather
//       Date: new Date().toLocaleDateString()
//     }));

//     const csv = Papa.unparse(csvData);

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "all_crops_data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//   } catch (err) {
//     console.error("CSV error:", err);
//   }
// };
//end

  return (
    <div className="dashboard-container">
{/* offline  */}
    {!navigator.onLine && (
      <div style={{ textAlign: 'center', color: 'orange' }}>
        ⚠️ You are offline. Showing last saved data.
      </div>
    )}
      <header className="dashboard-header">
        <h1>CropCare Advisor</h1>
        <p>Satellite-based health monitoring</p>
      </header>
      
      <CropSelector 
        selected={selectedCrop} 
        onSelect={(crop) => setSelectedCrop(crop)} 
      />
      <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
  <WeatherCard crop={selectedCrop} />
 
</div>
     
      {/*{console.log(data)}*/}
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
     {/*download csv button*/}
      <div style={{ textAlign: "center", margin: "10px" }}>
    <button
      onClick={downloadAllCSV}
      style={{
        padding: "10px 16px",
        backgroundColor: "#283f2d",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      📥 Download  CSV FILE
    </button>
</div>
{/* end */}


    </div>
  );
};

export default Dashboard;