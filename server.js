const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const parkirRoutes = require('./routes/parkirRoutes');
app.use('/api/parkir', parkirRoutes);

const pembayaranRoutes = require('./routes/pembayaranRoutes');
app.use('/api/pembayaran', pembayaranRoutes);

// 👇 INI YANG HILANG, KITA TAMBAHIN LAGI BRO 👇
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/laporan', reportRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'API Sistem Informasi Parkir',
    version: '1.0.0'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 500,
    message: 'Terjadi kesalahan server'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;