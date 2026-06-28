const UserModel     = require('../Models/user-model');
const Summary       = require('../Models/summary');
const ScheduleModel = require('../Models/schedule-model');
const QuizAttempt   = require('../Models/quiz-attempt-model');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today  = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    // Run all queries in parallel
    const [user, todaySchedule, summaryCount, recentAttempts] = await Promise.all([
      UserModel.findById(userId).select('name subjects hoursPerDay'),
      ScheduleModel.findOne({ userId, date: today }),
      Summary.countDocuments({ userId }),
      QuizAttempt.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('quizId', 'subject difficulty')
        .lean(),
    ]);

    // Today's task stats
    const totalTasks     = todaySchedule?.tasks.length     || 0;
    const completedTasks = todaySchedule?.tasks.filter(t => t.status === 'completed').length || 0;
    const taskPercent    = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Quiz accuracy (all-time)
    const quizAttempts = recentAttempts.length;
    const quizAccuracy = quizAttempts
      ? Math.round(recentAttempts.reduce((a, q) => a + (q.scorePercent || 0), 0) / quizAttempts)
      : 0;

    // Per-subject quiz accuracy map (for "weakest subject" card)
    const subjectScoreMap = {};
    for (const a of recentAttempts) {
      const subj = a.quizId?.subject || a.subject;
      if (!subj) continue;
      if (!subjectScoreMap[subj]) subjectScoreMap[subj] = [];
      subjectScoreMap[subj].push(a.scorePercent || 0);
    }

    const subjectStats = Object.entries(subjectScoreMap).map(([name, scores]) => ({
      name,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      attempts: scores.length,
    }));

    // Subjects that have never been summarized (stale subjects)
    const summarizedSubjects = await Summary.distinct('subject', { userId });
    const staleSubs = (user?.subjects || [])
      .filter(s => !summarizedSubjects.map(n => n.toLowerCase()).includes(s.name.toLowerCase()))
      .map(s => s.name);

    // Recent activity feed (last 5 meaningful events)
    const recentActivity = recentAttempts.slice(0, 5).map(a => ({
      type:    'quiz',
      subject: a.quizId?.subject || a.subject || 'Unknown',
      score:   a.scorePercent,
      date:    a.createdAt,
    }));

    res.json({
      user: {
        name:        user?.name,
        subjects:    user?.subjects?.length || 0,
        hoursPerDay: user?.hoursPerDay || 4,
      },
      today: {
        date:           today,
        hasSchedule:    !!todaySchedule,
        totalTasks,
        completedTasks,
        taskPercent,
        pendingTasks:   todaySchedule?.tasks.filter(t => t.status === 'pending') || [],
      },
      stats: {
        summaryCount,
        quizAttempts,
        quizAccuracy,
      },
      subjectStats,
      staleSubs,
      recentActivity,
    });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard.' });
  }
};

module.exports = { getDashboard };
