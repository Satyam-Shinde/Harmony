const axios         = require('axios');
const ScheduleModel = require('../Models/schedule-model');
const UserModel     = require('../Models/user-model');
const QuizAttempt   = require('../Models/quiz-attempt-model');

const PYTHON = process.env.PYTHON_API || 'http://127.0.0.1:8000';

/* ── Generate schedule ──────────────────────────────────────── */
const generateSchedule = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user || user.subjects.length === 0) {
      return res.status(400).json({ message: 'Add at least one subject before generating a schedule.' });
    }

    // Gather most recent quiz score % per subject
    const scoreMap = {};
    const recentAttempts = await QuizAttempt.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    for (const attempt of recentAttempts) {
      const subj = attempt.subject;
      if (subj && scoreMap[subj] === undefined) {
        scoreMap[subj] = attempt.scorePercent;
      }
    }

    // Build payload for Python, attaching recentScore where available
    const subjectsPayload = user.subjects.map(s => ({
      name:         s.name,
      marks:        s.marks,
      commandLevel: s.commandLevel,
      recentScore:  scoreMap[s.name] ?? null,
    }));

    const pyRes = await axios.post(`${PYTHON}/api/schedule/`, {
      subjects:    subjectsPayload,
      hoursPerDay: user.hoursPerDay || 4,
    });

    const data = pyRes.data;
    if (!data?.tasks) {
      return res.status(500).json({ message: 'Invalid response from scheduler service.' });
    }

    const schedule = await ScheduleModel.create({
      userId: user._id,
      date:   data.date,
      tasks:  data.tasks,
    });

    res.status(201).json(schedule);
  } catch (err) {
    console.error('generateSchedule error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to generate schedule.' });
  }
};

/* ── Get schedule by date ───────────────────────────────────── */
const getSchedule = async (req, res) => {
  try {
    const schedule = await ScheduleModel.findOne({ userId: req.user._id, date: req.params.date });
    res.json(schedule || null);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schedule.' });
  }
};

/* ── Update task status ─────────────────────────────────────── */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending or completed.' });
    }

    const schedule = await ScheduleModel.findOne({ 'tasks._id': taskId, userId: req.user._id });
    if (!schedule) return res.status(404).json({ message: 'Task not found.' });

    const task = schedule.tasks.id(taskId);
    task.status = status;
    await schedule.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

/* ── Schedule history ───────────────────────────────────────── */
const getScheduleHistory = async (req, res) => {
  try {
    const schedules = await ScheduleModel.find({ userId: req.user._id }).sort({ date: -1 });
    const history   = schedules.map(s => ({
      date:           s.date,
      totalTasks:     s.tasks.length,
      completedTasks: s.tasks.filter(t => t.status === 'completed').length,
    }));
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schedule history.' });
  }
};

module.exports = { generateSchedule, getSchedule, updateTask, getScheduleHistory };
