const express = require('express');
const router  = express.Router();
const { signupValidation, loginValidation } = require('../Middleware/auth-validation');
const { signup, login, forgotPassword, resetPassword } = require('../Controllers/auth-controller');

router.post('/signup',                signupValidation, signup);
router.post('/login',                 loginValidation,  login);
router.post('/forgot-password',                         forgotPassword);
router.post('/reset-password/:token',                   resetPassword);

module.exports = router;
