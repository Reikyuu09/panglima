const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModels');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-this';

const AuthController = {
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

      const userId = await UserModel.create({
        username,
        password,
        name,
        role: role || 'petugas'
      });

      res.status(201).json({
        success: true,
        message: 'User berhasil didaftarkan',
        data: { id_user: userId }
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

      const isPasswordValid = (user.password === password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Username atau password salah'
        });
      }

      const token = jwt.sign(
        {
          id: user.id_user,
          username: user.username,
          role: user.role?.toLowerCase()
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login berhasil',
        data: {
          token,
          user: {
            id_user: user.id_user,
            username: user.username,
            name: user.name,
            role: user.role?.toLowerCase()
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

  logout: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Logout berhasil'
    });
  }
};

module.exports = AuthController;