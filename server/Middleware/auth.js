const jwt       = require('jsonwebtoken');
const UserModel = require('../Models/user-model');

const ensureAuthenticated = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized — token missing' });
    }

    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?._id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await UserModel.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired — please log in again' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = ensureAuthenticated;
