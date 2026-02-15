// Simulates fetching fresh data from a satellite
const fetchSatelliteData = (cropType) => {
  // Generate random healthy-ish numbers (0.4 to 0.9)
  const ndvi = parseFloat((0.4 + Math.random() * 0.5).toFixed(2));
  const ndwi = parseFloat((0.3 + Math.random() * 0.6).toFixed(2));
  
  // Determine status based on NDVI
  let status = "Healthy";
  if (ndvi < 0.5) status = "Moderate";
  if (ndvi < 0.3) status = "Critical";

  return {
    ndvi,
    ndwiScore: ndwi,
    healthScore: parseFloat(((ndvi + ndwi) / 2).toFixed(2)),
    status,
    trend: ndvi > 0.6 ? "improving" : "declining",
    weeklyChange: ndvi > 0.6 ? "+5%" : "-12%"
  };
};

module.exports = { fetchSatelliteData };