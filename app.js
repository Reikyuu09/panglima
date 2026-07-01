const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto'); 
require('dotenv').config();

process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');

const app = express();
const authenticate = require('./middleware/authenticate');

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static folder uploads untuk akses foto
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const authRoutes = require('./routes/authRoutes');
const parkirRoutes = require('./routes/parkirRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');
const reportRoutes = require('./routes/reportRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/api');

app.use('/api/auth', authRoutes);
app.use('/api/parkir', authenticate, parkirRoutes);
app.use('/api/pembayaran', authenticate, pembayaranRoutes);
app.use('/api/laporan', authenticate, reportRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Sistem Informasi Parkir',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login',
      parkir: '/api/parkir',
      pembayaran: '/api/pembayaran',
      laporan: '/api/laporan/riwayat',
      users: '/api/users'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Endpoint tidak ditemukan: ${req.method} ${req.path}`,
    data: null
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);

  // Handle multer error
  if (err.message === 'Hanya file gambar yang diperbolehkan!') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      data: null
    });
  }

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    data: null
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`========================================\n`);
});

module.exports = app;