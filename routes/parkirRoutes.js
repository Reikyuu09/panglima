const express = require('express');
const router = express.Router();
const ParkirController = require('../controllers/ParkirController');
const authorize = require('../middleware/authorize');
const { validateCheckIn, validateUpdateKendaraan } = require('../validators/parkirValidator');

// Check-In Endpoint
router.post('/checkin', validateCheckIn, ParkirController.checkIn);

// Kendaraan CRUD Endpoints
router.post('/kendaraan', authorize('admin'), validateUpdateKendaraan, ParkirController.createKendaraan);
router.get('/kendaraan', ParkirController.getAllKendaraan); // Semua bisa lihat
router.put('/kendaraan/:id', authorize('admin'), validateUpdateKendaraan, ParkirController.updateKendaraan);
router.delete('/kendaraan/:id', authorize('admin'), ParkirController.deleteKendaraan);

// Parkir Endpoints
router.post('/keluar', ParkirController.keluar);
router.get('/', ParkirController.getAllParkir);
router.get('/:id', ParkirController.getParkirById);

module.exports = router;