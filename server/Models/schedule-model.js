const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  subject:          { type: String, required: true },
  topic:            { type: String, required: true },
  duration_minutes: { type: Number, required: true },
  status:           { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  date:   { type: String, required: true },
  tasks:  [taskSchema],
}, { timestamps: true });

module.exports = mongoose.model('schedules', scheduleSchema);
