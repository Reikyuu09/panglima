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
        'SELECT id_user, username, name, role, foto FROM tabeluser WHERE id_user = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error findById:', error);
      throw error;
    }
  },

  // Get all users (tanpa password)
  findAll: async () => {
    try {
      const [rows] = await db.query(
        'SELECT id_user, username, name, role, foto FROM tabeluser ORDER BY id_user DESC'
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
      const { username, password, name, role, foto } = userData;
      const [result] = await db.query(
        'INSERT INTO tabeluser (username, password, name, role, foto) VALUES (?, ?, ?, ?, ?)',
        [username, password, name, role || 'petugas', foto || null]
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
      const { username, password, name, role, foto } = userData;
      
      let query, params;
      
      if (password && foto) {
        // Update semua termasuk password dan foto
        query = 'UPDATE tabeluser SET username = ?, password = ?, name = ?, role = ?, foto = ? WHERE id_user = ?';
        params = [username, password, name, role, foto, id];
      } else if (password) {
        // Update dengan password baru, tanpa ganti foto
        query = 'UPDATE tabeluser SET username = ?, password = ?, name = ?, role = ? WHERE id_user = ?';
        params = [username, password, name, role, id];
      } else if (foto) {
        // Update foto saja, password tidak diubah
        query = 'UPDATE tabeluser SET username = ?, name = ?, role = ?, foto = ? WHERE id_user = ?';
        params = [username, name, role, foto, id];
      } else {
        // Update tanpa password dan foto
        query = 'UPDATE tabeluser SET username = ?, name = ?, role = ? WHERE id_user = ?';
        params = [username, name, role, id];
      }
      
      const [result] = await db.query(query, params);
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
  },

  // Get foto by user ID
  getFotoById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT foto FROM tabeluser WHERE id_user = ?',
        [id]
      );
      return rows[0]?.foto || null;
    } catch (error) {
      console.error('Error getFotoById:', error);
      throw error;
    }
  }
};

module.exports = UserModel;