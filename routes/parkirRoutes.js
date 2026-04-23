const express = require('express');
const router = express.Router();
const ParkirController = require('../controllers/ParkirController');
const { validateCheckIn, validateUpdateKendaraan } = require('../validators/parkirValidator');

// Check-In Endpoint
router.post('/checkin', validateCheckIn, ParkirController.checkIn);

// Kendaraan CRUD Endpoints
router.post('/kendaraan', validateUpdateKendaraan, ParkirController.createKendaraan);
router.get('/kendaraan', ParkirController.getAllKendaraan);
router.put('/kendaraan/:id', validateUpdateKendaraan, ParkirController.updateKendaraan);
router.delete('/kendaraan/:id', ParkirController.deleteKendaraan);

// Parkir Endpoints (untuk testing & laporan)
router.get('/', ParkirController.getAllParkir);
router.get('/:id', ParkirController.getParkirById);
router.post('/keluar', parkirController.keluar);

module.exports = router;