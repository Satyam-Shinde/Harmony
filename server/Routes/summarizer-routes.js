const express = require('express');
const multer  = require('multer');
const router  = express.Router();
const auth    = require('../Middleware/auth');
const upload  = multer({ dest: 'uploads/' });
const { summarizeText, summarizeFile, getSummaryHistory, getSummariesBySubject, deleteSummary } = require('../Controllers/summary-controller');

router.post('/summarize',              auth,                   summarizeText);
router.post('/file',                   auth, upload.single('file'), summarizeFile);
router.get( '/history',                auth,                   getSummaryHistory);
router.get( '/by-subject/:subject',    auth,                   getSummariesBySubject);
router.delete('/:id',                  auth,                   deleteSummary);

module.exports = router;
