const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const { error } = Joi.object({
    name:     Joi.string().min(2).max(100).required(),
    email:    Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  }).validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const loginValidation = (req, res, next) => {
  const { error } = Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  }).validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { signupValidation, loginValidation };
