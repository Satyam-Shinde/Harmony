const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  subject:      { type: String, required: true, trim: true },
  originalText: { type: String, required: true },
  summaryText:  { type: String, required: true },
  sourceType:   { type: String, enum: ['text', 'file'], required: true },
  fileName:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('summaries', summarySchema);
