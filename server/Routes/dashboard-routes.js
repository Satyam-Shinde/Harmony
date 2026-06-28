const express = require('express');
const router  = express.Router();
const auth    = require('../Middleware/auth');
const { getDashboard } = require('../Controllers/dashboard-controller');

router.get('/', auth, getDashboard);

module.exports = router;
