const express = require('express');
const router = express.Router();
const ParkirController = require('../controllers/parkirController');

// Route untuk Check-In
router.post('/checkin', ParkirController.checkIn);

// Route untuk testing - ambil semua data parkir
router.get('/', ParkirController.getAllParkir);

// Route untuk testing - ambil parkir by ID
router.get('/:id', ParkirController.getParkirById);

module.exports = router;