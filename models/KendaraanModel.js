const db = require('../config/database');

const KendaraanModel = {
  // Find kendaraan by plat nomor
  findByPlatNomor: async (plat_nomor) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tablekendaraan WHERE plat_nomor = ?',
        [plat_nomor.toUpperCase()]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding kendaraan: ${error.message}`);
    }
  },

  // Create new kendaraan
  create: async (data) => {
    try {
      const { plat_nomor, jenis_kendaraan } = data;
      const [result] = await db.query(
        'INSERT INTO tablekendaraan (plat_nomor, jenis_kendaraan) VALUES (?, ?)',
        [plat_nomor.toUpperCase(), jenis_kendaraan.toLowerCase()]
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating kendaraan: ${error.message}`);
    }
  },

  // Get all kendaraan
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM tablekendaraan ORDER BY Id_kendaraan DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error getting all kendaraan: ${error.message}`);
    }
  },

  // Update kendaraan
  update: async (id, data) => {
    try {
      const { plat_nomor, jenis_kendaraan } = data;
      const [result] = await db.query(
        'UPDATE tablekendaraan SET plat_nomor = ?, jenis_kendaraan = ? WHERE Id_kendaraan = ?',
        [plat_nomor.toUpperCase(), jenis_kendaraan.toLowerCase(), id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating kendaraan: ${error.message}`);
    }
  },

  // Delete kendaraan
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM tablekendaraan WHERE Id_kendaraan = ?',
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error deleting kendaraan: ${error.message}`);
    }
  }
};

module.exports = KendaraanModel;