const UserModel = require('../Models/user-model');

const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select('name email hoursPerDay timePreference subjects');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { hoursPerDay, timePreference } = req.body;
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (hoursPerDay   !== undefined) user.hoursPerDay   = hoursPerDay;
    if (timePreference !== undefined) user.timePreference = timePreference;
    await user.save();

    res.json({ message: 'Profile updated.', hoursPerDay: user.hoursPerDay, timePreference: user.timePreference });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ subjects: user.subjects || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const addSubject = async (req, res) => {
  try {
    const { name, marks, commandLevel } = req.body;
    if (!name) return res.status(400).json({ message: 'Subject name is required.' });

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Prevent duplicate subject names (case-insensitive)
    const exists = user.subjects.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) return res.status(409).json({ message: `Subject "${name}" already exists.` });

    const newSubject = { name, marks: marks || 0, commandLevel: commandLevel || 3 };
    user.subjects.push(newSubject);
    await user.save();

    // Return the newly pushed subject (last one)
    const saved = user.subjects[user.subjects.length - 1];
    res.status(201).json({ subject: saved });
  } catch (err) {
    console.error('addSubject error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, marks, commandLevel } = req.body;

    const user = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const subject = user.subjects.id(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    if (name         !== undefined) subject.name         = name;
    if (marks        !== undefined) subject.marks        = marks;
    if (commandLevel !== undefined) subject.commandLevel = commandLevel;

    await user.save();
    res.json({ subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const user   = await UserModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const subject = user.subjects.find(s => s._id.toString() === id);
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    user.subjects.pull(subject._id);
    await user.save();
    res.json({ message: 'Subject deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getUserProfile, updateProfile, getSubjects, addSubject, updateSubject, deleteSubject };
