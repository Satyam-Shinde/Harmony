const express = require('express');
const router  = express.Router();
const auth    = require('../Middleware/auth');
const { getUserProfile, updateProfile, getSubjects, addSubject, updateSubject, deleteSubject } = require('../Controllers/user-controller');

router.get( '/profile',       auth, getUserProfile);
router.put( '/profile',       auth, updateProfile);
router.get( '/subjects',      auth, getSubjects);
router.post('/subjects',      auth, addSubject);
router.put( '/subjects/:id',  auth, updateSubject);
router.delete('/subjects/:id',auth, deleteSubject);

module.exports = router;
