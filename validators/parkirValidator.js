// Validasi untuk Check-In
const validateCheckIn = (req, res, next) => {
  const { plat_nomor, jenis_kendaraan } = req.body;
  const errors = [];

  // Validasi plat nomor
  if (!plat_nomor) {
    errors.push({
      field: 'plat_nomor',
      message: 'Plat nomor wajib diisi'
    });
  } else if (typeof plat_nomor !== 'string') {
    errors.push({
      field: 'plat_nomor',
      message: 'Plat nomor harus berupa teks'
    });
  } else if (plat_nomor.trim().length < 5) {
    errors.push({
      field: 'plat_nomor',
      message: 'Plat nomor minimal 5 karakter'
    });
  }

  // Validasi jenis kendaraan
  if (!jenis_kendaraan) {
    errors.push({
      field: 'jenis_kendaraan',
      message: 'Jenis kendaraan wajib diisi'
    });
  } else if (!['motor', 'mobil'].includes(jenis_kendaraan.toLowerCase())) {
    errors.push({
      field: 'jenis_kendaraan',
      message: 'Jenis kendaraan harus motor atau mobil'
    });
  }

  // Jika ada error, return response error
  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Validasi gagal',
      errors: errors
    });
  }

  // Lanjut ke controller jika validasi lolos
  next();
};

// Validasi untuk update kendaraan
const validateUpdateKendaraan = (req, res, next) => {
  const { plat_nomor, jenis_kendaraan } = req.body;
  const errors = [];

  if (plat_nomor && typeof plat_nomor === 'string' && plat_nomor.trim().length < 5) {
    errors.push({
      field: 'plat_nomor',
      message: 'Plat nomor minimal 5 karakter'
    });
  }

  if (jenis_kendaraan && !['motor', 'mobil'].includes(jenis_kendaraan.toLowerCase())) {
    errors.push({
      field: 'jenis_kendaraan',
      message: 'Jenis kendaraan harus motor atau mobil'
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Validasi gagal',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateCheckIn,
  validateUpdateKendaraan
};