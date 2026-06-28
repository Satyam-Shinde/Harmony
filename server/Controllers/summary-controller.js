const axios    = require('axios');
const FormData = require('form-data');
const fs       = require('fs');
const Summary  = require('../Models/summary');

const PYTHON = process.env.PYTHON_API || 'http://127.0.0.1:8000';

/* ── Summarize raw text ─────────────────────────────────────── */
const summarizeText = async (req, res) => {
  try {
    const { text, subject } = req.body;
    if (!subject?.trim())    return res.status(400).json({ message: 'Subject is required.' });
    if (!text || text.length < 50) return res.status(400).json({ message: 'Text is too short (min 50 chars).' });

    const pyRes = await axios.post(`${PYTHON}/api/summarize/`, { text });
    const summaryText = pyRes.data.summary;

    const saved = await Summary.create({
      userId: req.user._id,
      subject: subject.trim(),
      originalText: text,
      summaryText,
      sourceType: 'text',
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error('summarizeText error:', err.response?.data || err.message);
    res.status(500).json({ message: 'Summarization failed.' });
  }
};

/* ── Summarize uploaded file ────────────────────────────────── */
const summarizeFile = async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject?.trim()) return res.status(400).json({ message: 'Subject is required.' });
    if (!req.file)        return res.status(400).json({ message: 'No file uploaded.' });

    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    const pyRes = await axios.post(`${PYTHON}/api/summarize/file`, formData, {
      headers: formData.getHeaders(),
    });

    const summaryText = pyRes.data.summary;

    const saved = await Summary.create({
      userId:       req.user._id,
      subject:      subject.trim(),
      originalText: '[FILE CONTENT]',
      summaryText,
      sourceType:   'file',
      fileName:     req.file.originalname,
    });

    // Clean up temp file
    fs.unlink(req.file.path, () => {});

    res.status(201).json(saved);
  } catch (err) {
    console.error('summarizeFile error:', err.message);
    res.status(500).json({ message: 'File summarization failed.' });
  }
};

/* ── History ────────────────────────────────────────────────── */
const getSummaryHistory = async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ count: summaries.length, summaries });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary history.' });
  }
};

/* ── Summaries for a specific subject (used by quiz picker) ─── */
const getSummariesBySubject = async (req, res) => {
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

/* ── Delete ─────────────────────────────────────────────────── */
const deleteSummary = async (req, res) => {
  try {
    const deleted = await Summary.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: 'Summary not found.' });
    res.json({ message: 'Summary deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete summary.' });
  }
};

module.exports = { summarizeText, summarizeFile, getSummaryHistory, getSummariesBySubject, deleteSummary };
