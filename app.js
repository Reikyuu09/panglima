const express = require('express');
require('dotenv').config();
const db = require('./db'); 
// const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// --- ROUTES ---

// 1. Route Beranda
app.get('/', (req, res) => {
  res.send('Server Parkir Panglima berjalan!');
});

// 2. Route Cek Koneksi Database
app.get('/cek-db', (req, res) => {
  db.query('SELECT 1 + 1 AS hasil', (err, results) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).send('Database tidak terhubung: ' + err.message);
    }
    res.send('Koneksi Database Aman! Hasil query: ' + results[0].hasil);
  });
});

// 3. Route Laporan Parkir
// app.use('/api/laporan', reportRoutes);

// --- PENUTUP ---

// Menjalankan server (Selalu di paling bawah)
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});