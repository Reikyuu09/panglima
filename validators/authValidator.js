// Validasi untuk Register
const validateRegister = (req, res, next) => {
  const { username, password, name, role } = req.body;
  const errors = [];

  // Validasi username
  if (!username) {
    errors.push({ field: 'username', message: 'Username wajib diisi' });
  } else if (username.length < 4) {
    errors.push({ field: 'username', message: 'Username minimal 4 karakter' });
  }

  // Validasi password
  if (!password) {
    errors.push({ field: 'password', message: 'Password wajib diisi' });
  } else if (password.length < 6) {
    errors.push({ field: 'password', message: 'Password minimal 6 karakter' });
  }

  // Validasi name
  if (!name) {
    errors.push({ field: 'name', message: 'Name wajib diisi' });
  }

  // Validasi role (optional)
  if (role && !['admin', 'petugas'].includes(role)) {
    errors.push({ field: 'role', message: 'Role harus admin atau petugas' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors
    });
  }

  next();
};

// Validasi untuk Login
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username) {
    errors.push({ field: 'username', message: 'Username wajib diisi' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password wajib diisi' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin
};