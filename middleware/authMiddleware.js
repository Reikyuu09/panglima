const jwt = require('jsonwebtoken');
// Middleware untuk Authentication (Cek login)
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });

    try {
        const verified = jwt.verify(token, 'panglima'); // Ganti dengan secret key kamu
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token tidak valid' });
    }
};

// Middleware untuk Authorization (Role-based access)
const authorizeRole = (role) => {
    return (req, res, next) => {
        // Cek apakah role user sesuai dengan yang diizinkan (misal: 'admin')
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Akses dilarang: Anda bukan ' + role });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };