const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question:     { type: String, required: true },
  options:      { type: [String], required: true, validate: v => v.length === 4 },
  correctIndex: { type: Number, required: true, min: 0, max: 3 },
});

const quizSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'users',     required: true },
  summaryId:    { type: mongoose.Schema.Types.ObjectId, ref: 'summaries'               },
  subject:      { type: String, required: true },
  commandLevel: { type: Number, required: true, min: 1, max: 5 },
  difficulty:   { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questions:    { type: [questionSchema], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
