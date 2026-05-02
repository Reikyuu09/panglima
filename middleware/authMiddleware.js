const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu'
      });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Simpan user info di request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau kadaluarsa',
      error: error.message
    });
  }
};

module.exports = authMiddleware;