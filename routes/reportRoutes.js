const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const reportController = require('../controllers/reportController');

router.get('/riwayat', authorize('admin'), reportController.ambilRiwayat);

module.exports = router;