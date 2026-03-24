const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  regionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' }, // ✅ ADD
  title: String,
  cause: String,
  prediction: String,
  recommendation: String,
  tags: [String],
  difficulty: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Insight', insightSchema);