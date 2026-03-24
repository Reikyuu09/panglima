const express = require('express');
const app = express();
const PORT = 3000;

// Middleware dasar agar bisa baca JSON
app.use(express.json());

// Import routes
const apiRoutes = require('./routes/api');

// Gunakan routes
app.use('/api', apiRoutes);

// Halaman Utama (Tes Server)
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "Server Parkir Berhasil Jalan!",
        kelompok: "Sistem Informasi Parkir"
    });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});