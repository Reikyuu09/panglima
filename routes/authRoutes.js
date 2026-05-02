const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// Register user baru
router.post('/register', validateRegister, AuthController.register);

// Login user
router.post('/login', validateLogin, AuthController.login);

// Logout
router.post('/logout', AuthController.logout);

module.exports = router;