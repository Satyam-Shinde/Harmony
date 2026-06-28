const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedIndex: Number,
  correctIndex:  Number,
  isCorrect:     Boolean,
});

const quizAttemptSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  quizId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz',  required: true },
  subject:        { type: String },
  answers:        [answerSchema],
  score:          { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  scorePercent:   { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
