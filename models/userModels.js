const db = require('../config/database');

const UserModel = {
  // Find user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabeluser WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error findByUsername:', error);
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabeluser WHERE id_user = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error findById:', error);
      throw error;
    }
  },

  // Get all users
  findAll: async () => {
    try {
      const [rows] = await db.query(
        'SELECT id_user, username, name, role FROM tabeluser'
      );
      return rows;
    } catch (error) {
      console.error('Error findAll:', error);
      throw error;
    }
  },

  // Create new user
  create: async (userData) => {
    try {
      const { username, password, name, role } = userData;
      const [result] = await db.query(
        'INSERT INTO tabeluser (username, password, name, role) VALUES (?, ?, ?, ?)',
        [username, password, name, role || 'petugas']
      );
      return result.insertId;
    } catch (error) {
      console.error('Error create user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const { username, password, name, role } = userData;
      const [result] = await db.query(
        'UPDATE tabeluser SET username = ?, password = ?, name = ?, role = ? WHERE id_user = ?',
        [username, password, name, role, id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error update user:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM tabeluser WHERE id_user = ?',
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error('Error delete user:', error);
      throw error;
    }
  }
};

module.exports = UserModel;