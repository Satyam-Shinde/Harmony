const express = require('express');
const router  = express.Router();
const auth    = require('../Middleware/auth');
const { getSubjectSummaries, generateQuiz, submitQuizAttempt, getQuizHistory } = require('../Controllers/quiz-controller');

router.get( '/summaries/:subject', auth, getSubjectSummaries);
router.post('/generate',           auth, generateQuiz);
router.post('/attempt',            auth, submitQuizAttempt);
router.get( '/history',            auth, getQuizHistory);

module.exports = router;
