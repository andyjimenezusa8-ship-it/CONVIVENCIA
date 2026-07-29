const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', getSettings);
router.put('/', authenticateToken, requireRole(['ADMIN']), updateSettings);

module.exports = router;
