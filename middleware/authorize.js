// Middleware untuk mengecek role user
const authorize = (...roles) => {
  return (req, res, next) => {
    // Cek apakah user sudah login (req.user diset oleh auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Silakan login terlebih dahulu'
      });
    }

    // Cek apakah role user termasuk yang diizinkan
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses resource ini'
      });
    }

    // Lanjutkan ke controller
    next();
  };
};

module.exports = authorize;