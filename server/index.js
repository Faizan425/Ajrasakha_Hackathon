const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Region = require('./models/Region');
const CropData = require('./models/CropData');
const { fetchSatelliteData } = require('./satellite');
const Alert = require('./models/Alert'); 
const cron = require('node-cron');

const app = express();
app.use(cors()); 
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/Hackathon_db')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error(err));



app.get('/api/regions', async (req, res) => {
  try {
    const regions = await Region.find();
    
    // This uses "Promise.all" to do it fast
    const regionsWithStatus = await Promise.all(regions.map(async (region) => {
      const latestData = await CropData.findOne({ regionId: region._id })
                                       .sort({ timestamp: -1 });
      
      return {
        _id: region._id,
        name: region.name,
        coordinates: region.coordinates,
        
        cropType: region.cropType,
        status: latestData ? latestData.metrics.status : "Unknown" 
      };
    }));

    res.json(regionsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns the specific crop health stats for a dot
app.get('/api/regions/:id/data', async (req, res) => {
  const data = await CropData.findOne({ regionId: req.params.id })
                             .sort({ timestamp: -1 }); 
  res.json(data);
});


// The "Big Red Button" - Updates all regions with new satellite data
app.post('/api/run-pipeline', async (req, res) => {
  const start = Date.now();
  
  
  const regions = await Region.find();
  
  
  for (const region of regions) {
    const newData = fetchSatelliteData(region.cropType);
    
    await CropData.create({
      regionId: region._id,
      metrics: newData
    });
  }

  res.json({
    status: "Success",
    message: `Updated ${regions.length} regions via Satellite Link.`,
    time: `${Date.now() - start}ms`
  });
});

app.get('/api/regions/:id/health', async (req, res) => {
  try {
    // 1. Get the Region Name
    const region = await Region.findById(req.params.id);
    if (!region) return res.status(404).json({ error: "Region not found" });

    
    const allData = await CropData.find({ regionId: req.params.id })
                                  .sort({ timestamp: -1 }); 

    if (!allData.length) return res.json({ regionName: region.name, latestNDVI: 0, status: "No Data", history: [] });

    
    const response = {
      regionName: region.name,
      latestNDVI: allData[0].metrics.ndvi,
      status: allData[0].metrics.status,
      // Convert DB history to simple array
      history: allData.map(d => ({
        date: d.timestamp, 
        ndvi: d.metrics.ndvi
      }))
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


cron.schedule('0 0 * * *', async () => {
  console.log('⏰ CRON JOB STARTED: Fetching daily satellite data...');
  
  try {
    const regions = await Region.find();
    let count = 0;

    for (const region of regions) {
      
      const newData = fetchSatelliteData(region.cropType); 
      
      
      await CropData.create({
        regionId: region._id,
        metrics: newData
      });
      count++;
    }
    console.log(`✅ CRON JOB FINISHED: Updated ${count} regions.`);
  } catch (err) {
    console.error('❌ CRON JOB FAILED:', err);
  }
});


app.get('/api/alerts', async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});