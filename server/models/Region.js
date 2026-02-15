const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
  name: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  cropType: String // Rice, Wheat, Cotton, etc.
});

module.exports = mongoose.model('Region', RegionSchema);