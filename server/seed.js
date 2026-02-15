const seedDB = async () => {
  // 1. CLEAR OLD DATA
  await Region.deleteMany({});
  await CropData.deleteMany({});
  await Alert.deleteMany({}); // Clear alerts too

  // 2. CREATE REGIONS (Map Dots)
  // We added Corn (Karnataka) and Soybean (Madhya Pradesh)
  const regions = await Region.insertMany([
    { name: "Punjab Sector A",    coordinates: { lat: 30.9, lng: 75.8 }, cropType: "Rice" },
    { name: "Vidarbha Zone 1",    coordinates: { lat: 21.1, lng: 79.0 }, cropType: "Cotton" },
    { name: "Haryana Belt",       coordinates: { lat: 29.0, lng: 76.0 }, cropType: "Wheat" },
    { name: "Karnataka Fields",   coordinates: { lat: 15.3, lng: 75.7 }, cropType: "Corn" },
    { name: "MP Soybean Belt",    coordinates: { lat: 23.2, lng: 77.4 }, cropType: "Soybean" }
  ]);

  console.log("📍 Created 5 Regions");

  // 3. CREATE INITIAL DATA FOR EACH REGION
  for (const region of regions) {
    const fakeData = fetchSatelliteData(region.cropType);
    await CropData.create({
      regionId: region._id,
      metrics: fakeData
    });
  }
  console.log("📊 Satellite Data Generated");

  // 4. CREATE ALERTS
  await Alert.insertMany([
    { crop: "Cotton", type: "Health", severity: "high", message: "NDVI dropped by 15%. Pest risk.", action: "Apply organic pesticide.", date: "2h ago", status: "active" },
    { crop: "Rice", type: "Moisture", severity: "medium", message: "Soil moisture low.", action: "Initiate irrigation.", date: "5h ago", status: "active" },
    { crop: "Corn", type: "Health", severity: "low", message: "Minor yellowing observed.", action: "Check nitrogen levels.", date: "1d ago", status: "active" }
  ]);
  console.log("🚨 Alerts Seeded!");

  console.log("✅ Database Fully Seeded!");
  process.exit();
};

seedDB();