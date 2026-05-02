const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const parkirRoutes = require('./routes/parkirRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/parkir', parkirRoutes);
app.use('/api/pembayaran', pembayaranRoutes);
app.use('/api/laporan', reportRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Sistem Informasi Parkir',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      parkir: '/api/parkir',
      pembayaran: '/api/pembayaran',
      laporan: '/api/laporan'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;