const express = require("express");
const router = express.Router();
const pembayaranController = require("../controllers/pembayaranController");

router.post("/pembayaran", pembayaranController.prosesPembayaran);

module.exports = router;