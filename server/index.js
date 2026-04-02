const path = require('path');
// __dirname is the absolute path to the folder containing this index.js file
require('dotenv').config({ path: path.join(__dirname, '../.env') }); 

console.log("MY API KEY IS:", process.env.GEMINI_API_KEY);
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const Region = require('./models/Region');
const CropData = require('./models/CropData');
const { fetchSatelliteData } = require('./satellite');
const Alert = require('./models/Alert');
const Insight = require('./models/Insight');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const cron = require('node-cron');


const JWT_SECRET = "super_secret_hackathon_key_2026";

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
        latestNDVI:region.latestNDVI,
        cropType: region.cropType,
        status: region.status
      };
    }));

    res.json(regionsWithStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const {username, password} = req.body;

  if(username === 'admin' && password === 'admin123') {
    const token = jwt.sign({role: 'admin'}, JWT_SECRET, {expiresIn: '2h'});
    res.json({ token });
  } else {
    res.status(401).json({error: 'Invalid credentials'});
  }
});

const verifyAdmin = (req, res, next) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader){ return res.status(403).json({error: "Access Denied: No Token Provided!" });}

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) return res.status(401).json({ error: "Invalid or Expired Token!" });
    next();
  });
};

app.post('/api/alerts', verifyAdmin , async (req,res) => {
  try {
    const newAlert = await Alert.create({
      ...req.body,
      date: "Just now",
      status: "active"
    });
    res.json(newAlert);
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
    const newData = fetchSatelliteData(region.name);
    
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
    const region = await Region.findById(req.params.id);
    if (!region) return res.status(404).json({ error: "Region not found" });

    const allData = await CropData.find({ regionId: req.params.id })
                                  .sort({ timestamp: -1 }); 

    // If we have history, use the latest from history, otherwise use region-level defaults
    const latestData = allData[0];
    
    const response = {
      regionName: region.name,
      cropType: region.cropType,
      latestNDVI: latestData ? (latestData.metrics?.ndvi || 0) : (region.latestNDVI || 0),
      status: latestData ? (latestData.metrics?.status || "Unknown") : (region.status || "Unknown"),
      trend: latestData ? (latestData.metrics?.trend || "stable") : (region.trend || "stable"),
      healthScore: latestData ? (latestData.metrics?.healthScore || 0) : (region.latestNDVI * 100 || 0),
      ndwiScore: latestData ? (latestData.metrics?.ndwiScore || 0) : 0.5,
      history: allData.map(d => ({
        date: d.timestamp, 
        ndvi: d.metrics?.ndvi || 0,
        status: d.metrics?.status || "Unknown"
      }))
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/insights', async (req, res) => {
  try {
    const insights = await Insight.find().sort({ date: -1 });
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREATE INSIGHT (Protected Admin Route)
app.post('/api/insights', verifyAdmin, async (req, res) => {
  try {
    const newInsight = await Insight.create(req.body);
    res.json(newInsight);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- THE REAL "DEEP ANALYSIS" AI ROUTE ---
app.post('/api/analyze', async (req, res) => {
  const { title, cause, prediction } = req.body;
  
  try {
    // 1. Select the Gemini 1.5 Flash model (it is incredibly fast)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. The "System Prompt" - This is where you tell the AI how to behave
    const prompt = `
      You are an expert agricultural scientist and government policy advisor in India. 
      Analyze the following crop issue reported by a satellite monitoring system:
      
      - Alert Title: ${title}
      - Detected Cause: ${cause}
      - Risk/Prediction: ${prediction}
      
      Provide a highly professional, concise, 3-step actionable intervention plan to mitigate this issue. 
      Format your response as a simple list. Do not use markdown formatting like **bolding** or # headers. Keep it strictly under 5 sentences.
    `;

    // 3. Send the prompt to Gemini and wait for the response
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();
    
    // 4. Send the AI's brilliant plan back to your React frontend
    res.json({ analysis: aiResponse });

  } catch (err) {
    console.error("AI Generation Error:", err);
    res.status(500).json({ error: "AI Engine Failed to respond." });
  }
});

app.put('/api/alerts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // We will send 'active' or 'completed' from React
    
    // Find the alert by ID and update its status
    const updatedAlert = await Alert.findByIdAndUpdate(
      id, 
      { status: status.toLowerCase() }, 
      { new: true } // Returns the updated document
    );
    
    res.json(updatedAlert);
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
      
      const satelliteData = await fetchSatelliteData(region.name);  
      
      
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