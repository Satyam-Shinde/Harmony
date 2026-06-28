const express = require('express');
const router  = express.Router();
const auth    = require('../Middleware/auth');
const { generateSchedule, getSchedule, updateTask, getScheduleHistory } = require('../Controllers/scheduler-controller');

router.post(  '/generate',        auth, generateSchedule);
router.get(   '/history',         auth, getScheduleHistory);
router.get(   '/:date',           auth, getSchedule);
router.patch( '/task/:taskId',    auth, updateTask);

module.exports = router;
