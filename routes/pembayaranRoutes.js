const express = require('express');
const router = express.Router();
const PembayaranController = require('../controllers/pembayaranController');

// Proses pembayaran
router.post('/proses', PembayaranController.prosesPembayaran);

// Get all pembayaran
router.get('/', PembayaranController.getAllPembayaran);

// Get pembayaran by id_parkir
router.get('/parkir/:id_parkir', PembayaranController.getPembayaranByParkirId);

module.exports = router;