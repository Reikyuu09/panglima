const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModels');
// const bcrypt = require('bcryptjs'); // Comment out untuk testing plain text

const AuthController = {
  // Register User Baru
  register: async (req, res) => {
    try {
      const { username, password, name, role } = req.body;

      if (!username || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Username, password, dan name wajib diisi'
        });
      }

      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username sudah terdaftar'
        });
      }

      // Untuk testing: password plain text
      // Untuk production: gunakan bcrypt
      // const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await UserModel.create({
        username,
        password, // plain text untuk testing
        name,
        role: role || 'petugas'
      });

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan',
        data: { id_user: userId }  // ← ✅ Tambah key "data:"
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: error.message
      });
    }
  },

  // Login User
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username dan password wajib diisi'
        });
      }

      const user = await UserModel.findByUsername(username);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      // Cek password (plain text untuk testing)
      // Untuk production: const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = (user.password === password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id_user,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET || 'secret-key-change-this',
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {  // ← ✅ Tambah key "data:" DI SINI!
          token,
          user: {
            id_user: user.id_user,
            username: user.username,
            name: user.name,
            role: user.role
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: error.message
      });
    }
  },

  // Logout
  logout: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Logout berhasil'
    });
  }
};

module.exports = AuthController;