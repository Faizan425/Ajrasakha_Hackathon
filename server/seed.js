const mongoose = require('mongoose');
const Region = require('./models/Region'); 
const Alert = require('./models/Alert'); 
const CropData = require('./models/CropData'); 

const MONGO_URI = "mongodb://localhost:27017/Hackathon_db";

const seedRegions = [
  { name: "Thanjavur Rice Belt (Tamil Nadu)", coordinates: { lat: 11.1271, lng: 78.6569 }, cropType: "Rice", status: "Healthy", latestNDVI: 0.72, trend: "improving" },
  { name: "Godavari Basin (Andhra Pradesh)", coordinates: { lat: 15.9129, lng: 79.7400 }, cropType: "Rice", status: "Moderate", latestNDVI: 0.45, trend: "declining" },
  { name: "Dharwad Farms (Karnataka)", coordinates: { lat: 15.3173, lng: 75.7139 }, cropType: "Cotton", status: "Critical", latestNDVI: 0.25, trend: "declining" },
  { name: "Palakkad Gap (Kerala)", coordinates: { lat: 10.8505, lng: 76.2711 }, cropType: "Rice", status: "Healthy", latestNDVI: 0.68, trend: "stable" },
  { name: "Warangal Area (Telangana)", coordinates: { lat: 18.1124, lng: 79.0193 }, cropType: "Cotton", status: "Healthy", latestNDVI: 0.70, trend: "stable" },

  { name: "Vidarbha Region (Maharashtra)", coordinates: { lat: 19.7515, lng: 75.7139 }, cropType: "Cotton", status: "Moderate", latestNDVI: 0.48, trend: "improving" },
  { name: "Saurashtra Zone (Gujarat)", coordinates: { lat: 22.2587, lng: 71.1924 }, cropType: "Groundnut", status: "Healthy", latestNDVI: 0.65, trend: "improving" },
  { name: "Marwar Pockets (Rajasthan)", coordinates: { lat: 27.0238, lng: 74.2179 }, cropType: "Mustard", status: "Critical", latestNDVI: 0.22, trend: "declining" },
  { name: "Malwa Plateau (Madhya Pradesh)", coordinates: { lat: 22.9734, lng: 78.6569 }, cropType: "Soybean", status: "Healthy", latestNDVI: 0.75, trend: "improving" },
  { name: "Bastar Area (Chhattisgarh)", coordinates: { lat: 21.2787, lng: 81.8661 }, cropType: "Rice", status: "Healthy", latestNDVI: 0.62, trend: "stable" },

  { name: "Western UP Belt (Uttar Pradesh)", coordinates: { lat: 26.8467, lng: 80.9462 }, cropType: "Sugarcane", status: "Healthy", latestNDVI: 0.78, trend: "improving" },
  { name: "Bhojpur Plains (Bihar)", coordinates: { lat: 25.0961, lng: 85.3131 }, cropType: "Rice", status: "Moderate", latestNDVI: 0.52, trend: "improving" },
  { name: "Chota Nagpur (Jharkhand)", coordinates: { lat: 23.6102, lng: 85.2799 }, cropType: "Pulses", status: "Healthy", latestNDVI: 0.60, trend: "stable" },
  { name: "Hooghly Delta (West Bengal)", coordinates: { lat: 22.9868, lng: 87.8550 }, cropType: "Jute", status: "Healthy", latestNDVI: 0.71, trend: "improving" },
  { name: "Coastal Odisha (Odisha)", coordinates: { lat: 20.9517, lng: 85.0985 }, cropType: "Rice", status: "Moderate", latestNDVI: 0.55, trend: "declining" },

  { name: "Ludhiana Fields (Punjab)", coordinates: { lat: 31.1471, lng: 75.3412 }, cropType: "Wheat", status: "Healthy", latestNDVI: 0.81, trend: "improving" },
  { name: "Rohtak Area (Haryana)", coordinates: { lat: 29.0588, lng: 76.0856 }, cropType: "Wheat", status: "Healthy", latestNDVI: 0.79, trend: "stable" },
  { name: "Kangra Valley (Himachal Pradesh)", coordinates: { lat: 31.1048, lng: 77.1734 }, cropType: "Apples", status: "Healthy", latestNDVI: 0.66, trend: "stable" },
  { name: "Terai Region (Uttarakhand)", coordinates: { lat: 30.0668, lng: 79.0193 }, cropType: "Rice", status: "Healthy", latestNDVI: 0.69, trend: "improving" },

  { name: "Brahmaputra Valley (Assam)", coordinates: { lat: 26.2006, lng: 92.9376 }, cropType: "Tea", status: "Healthy", latestNDVI: 0.85, trend: "improving" },
  { name: "Tawang Slopes (Arunachal Pradesh)", coordinates: { lat: 28.2180, lng: 94.7278 }, cropType: "Maize", status: "Healthy", latestNDVI: 0.63, trend: "stable" },
  { name: "Imphal East (Manipur)", coordinates: { lat: 24.6637, lng: 93.9063 }, cropType: "Rice", status: "Moderate", latestNDVI: 0.58, trend: "declining" },
  { name: "Shillong Plateau (Meghalaya)", coordinates: { lat: 25.4670, lng: 91.3662 }, cropType: "Pineapple", status: "Healthy", latestNDVI: 0.74, trend: "improving" },
  { name: "Aizawl Hills (Mizoram)", coordinates: { lat: 23.1645, lng: 92.9376 }, cropType: "Bamboo", status: "Healthy", latestNDVI: 0.77, trend: "stable" },
  { name: "Kohima Farms (Nagaland)", coordinates: { lat: 26.1584, lng: 94.5624 }, cropType: "Rice", status: "Healthy", latestNDVI: 0.61, trend: "improving" },
  { name: "Agartala Sector (Tripura)", coordinates: { lat: 23.9408, lng: 91.9882 }, cropType: "Rubber", status: "Healthy", latestNDVI: 0.70, trend: "stable" },
  { name: "Gangtok Valley (Sikkim)", coordinates: { lat: 27.5330, lng: 88.5122 }, cropType: "Cardamom", status: "Healthy", latestNDVI: 0.82, trend: "improving" },

  { name: "South Goa Farms (Goa)", coordinates: { lat: 15.2993, lng: 74.1240 }, cropType: "Cashew", status: "Healthy", latestNDVI: 0.67, trend: "stable" },
];

const seedAlerts = [
  { 
    crop: "Cotton", 
    type: "Health", 
    severity: "high", 
    message: "NDVI dropped critically in Dharwad. Pest risk high.", 
    action: "Dispatch drone survey immediately.", 
    date: "Just now", 
    status: "active" 
  },
  { 
    crop: "Rice", 
    type: "Moisture", 
    severity: "medium", 
    message: "Moderate moisture stress in Godavari Basin.", 
    action: "Increase irrigation cycle by 15%.", 
    date: "2h ago", 
    status: "active" 
  },
  { 
    crop: "Mustard", 
    type: "Weather", 
    severity: "high", 
    message: "Heatwave warning in Rajasthan. Mustard crop at risk.", 
    action: "Apply protective mulch and increase watering.", 
    date: "1h ago", 
    status: "active" 
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("📦 Connected to MongoDB.");

    await Region.deleteMany({});
    await Alert.deleteMany({});
    await CropData.deleteMany({});
    
    console.log("🧹 Cleared out old database collections.");

    const createdRegions = await Region.insertMany(seedRegions);
    console.log(`📍 Created ${createdRegions.length} Regions across all states.`);

    // CREATE CROP DATA FOR EACH REGION
    const cropDataEntries = createdRegions.map(region => ({
      regionId: region._id,
      timestamp: new Date(),
      metrics: {
        ndvi: region.latestNDVI,
        ndwiScore: Math.random() * 0.5 + 0.3,
        healthScore: Math.floor(region.latestNDVI * 100),
        status: region.status,
        trend: region.trend,
        weeklyChange: (Math.random() > 0.5 ? "+" : "-") + (Math.floor(Math.random() * 5) + 1) + "%"
      }
    }));

    await CropData.insertMany(cropDataEntries);
    console.log(`📊 Generated detailed sensor metrics for all regions.`);

    await Alert.insertMany(seedAlerts);
    console.log("🚨 Seeded initial Alerts.");

    console.log("✅ Database Fully Seeded & Ready for the Judges!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });