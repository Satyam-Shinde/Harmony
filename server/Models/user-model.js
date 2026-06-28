const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  marks:        { type: Number, default: 0 },
  commandLevel: { type: Number, min: 1, max: 5, default: 3 },
});

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  password:         { type: String, required: true },
  hoursPerDay:      { type: Number, default: 4 },
  timePreference:   { type: String, enum: ['morning','evening','night'], default: 'morning' },
  subjects:         [subjectSchema],
  resetToken:       String,
  resetTokenExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
