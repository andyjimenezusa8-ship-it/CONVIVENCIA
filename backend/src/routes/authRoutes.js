const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { loginLimiter } = require('../middlewares/rateLimiter');

router.post('/login', loginLimiter, login);
router.get('/me', authenticateToken, getProfile);

module.exports = router;
