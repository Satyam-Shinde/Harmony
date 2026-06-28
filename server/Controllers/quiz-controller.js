const axios       = require('axios');
const Quiz        = require('../Models/quiz-model');
const UserModel   = require('../Models/user-model');
const QuizAttempt = require('../Models/quiz-attempt-model');
const Summary     = require('../Models/summary');

const PYTHON = process.env.PYTHON_API || 'http://127.0.0.1:8000';

const levelFromScore = (score, current) => {
  if (score >= 80) return Math.min(5, current + 1);
  if (score <= 40) return Math.max(1, current - 1);
  return current;
};

const difficultyFromLevel = level => {
  if (level <= 2) return 'easy';
  if (level === 3) return 'medium';
  return 'hard';
};

/* ── GET summaries for subject (quiz picker) ─────────────────── */
const getSubjectSummaries = async (req, res) => {
  try {
    const subject = decodeURIComponent(req.params.subject);
    const summaries = await Summary.find({
      userId:  req.user._id,
      subject: { $regex: new RegExp(`^${subject}$`, 'i') },
    })
      .sort({ createdAt: -1 })
      .select('_id subject summaryText sourceType fileName createdAt')
      .lean();
    res.json({ summaries });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summaries.' });
  }
};

/* ── POST generate quiz ──────────────────────────────────────── */
const generateQuiz = async (req, res) => {
  try {
    const { subject, summaryId } = req.body;
    if (!subject?.trim()) return res.status(400).json({ message: 'Subject is required.' });

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const userSubject = user.subjects.find(s => s.name.toLowerCase() === subject.toLowerCase());
    if (!userSubject) return res.status(404).json({ message: `Subject "${subject}" not found in your profile.` });

    // Resolve summary to use as context
    let summary;
    if (summaryId) {
      summary = await Summary.findOne({ _id: summaryId, userId: user._id }).lean();
      if (!summary) return res.status(404).json({ message: 'Selected summary not found.' });
    } else {
      summary = await Summary.findOne({
        userId:  user._id,
        subject: { $regex: new RegExp(`^${subject.trim()}$`, 'i') },
      }).sort({ createdAt: -1 }).lean();

      if (!summary) {
        return res.status(400).json({
          message: `No summaries found for "${subject}". Please generate a summary first.`,
        });
      }
    }

    const difficulty = difficultyFromLevel(userSubject.commandLevel);

    const pyRes = await axios.post(`${PYTHON}/api/quiz/generate`, {
      subject:       subject.trim(),
      difficulty,
      num_questions: 5,
      context:       summary.summaryText,
    });

    const questions = pyRes.data.questions;
    if (!questions?.length) return res.status(500).json({ message: 'Quiz generation failed.' });

    const quiz = await Quiz.create({
      userId:       user._id,
      summaryId:    summary._id,
      subject:      subject.trim(),
      commandLevel: userSubject.commandLevel,
      difficulty,
      questions,
    });

    res.status(201).json({
      ...quiz.toObject(),
      sourceSummary: {
        _id:        summary._id,
        summaryText: summary.summaryText,
        createdAt:  summary.createdAt,
        sourceType: summary.sourceType,
        fileName:   summary.fileName || null,
      },
    });
  } catch (err) {
    console.error('generateQuiz error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate quiz.' });
  }
};

/* ── POST submit attempt — evaluates + auto-updates commandLevel */
const submitQuizAttempt = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    if (!quizId || !answers) return res.status(400).json({ message: 'quizId and answers are required.' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found.' });

    let score = 0;
    const breakdown = answers.map(ans => {
      const q         = quiz.questions[ans.questionIndex];
      const isCorrect = ans.selectedIndex === q.correctIndex;
      if (isCorrect) score++;
      return {
        questionIndex: ans.questionIndex,
        selectedIndex: ans.selectedIndex,
        correctIndex:  q.correctIndex,
        isCorrect,
        questionText:  q.question,
        options:       q.options,
      };
    });

    const scorePercent = Math.round((score / quiz.questions.length) * 100);

    await QuizAttempt.create({
      userId:         req.user._id,
      quizId,
      subject:        quiz.subject,
      answers:        breakdown.map(({ questionIndex, selectedIndex, correctIndex, isCorrect }) =>
                        ({ questionIndex, selectedIndex, correctIndex, isCorrect })),
      score,
      totalQuestions: quiz.questions.length,
      scorePercent,
    });

    // ── Auto-update commandLevel ─────────────────────────────
    const user        = await UserModel.findById(req.user._id);
    const userSubject = user?.subjects.find(s => s.name.toLowerCase() === quiz.subject.toLowerCase());

    let newCommandLevel = userSubject?.commandLevel;
    if (userSubject) {
      newCommandLevel = levelFromScore(scorePercent, userSubject.commandLevel);
      if (newCommandLevel !== userSubject.commandLevel) {
        userSubject.commandLevel = newCommandLevel;
        await user.save();
      }
    }

    res.json({
      score,
      totalQuestions:  quiz.questions.length,
      scorePercent,
      breakdown,
      commandLevelUpdate: {
        previous: userSubject?.commandLevel === newCommandLevel ? newCommandLevel : quiz.commandLevel,
        current:  newCommandLevel,
        changed:  newCommandLevel !== quiz.commandLevel,
      },
    });
  } catch (err) {
    console.error('submitQuizAttempt error:', err.message);
    res.status(500).json({ message: 'Failed to submit quiz.' });
  }
};

/* ── GET quiz history ─────────────────────────────────────────── */
const getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate('quizId', 'subject difficulty')
      .sort({ createdAt: -1 });

    const history = attempts.map(a => ({
      subject:        a.quizId?.subject  || a.subject || 'Unknown',
      difficulty:     a.quizId?.difficulty || '—',
      score:          a.score,
      totalQuestions: a.totalQuestions,
      scorePercent:   a.scorePercent,
      date:           a.createdAt,
    }));

    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quiz history.' });
  }
};

module.exports = { getSubjectSummaries, generateQuiz, submitQuizAttempt, getQuizHistory };
