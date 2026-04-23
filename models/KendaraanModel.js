const db = require('../config/database');

const KendaraanModel = {
  // Cari kendaraan berdasarkan plat nomor
  findByPlatNomor: async (plat_nomor) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tablekendaraan WHERE plat_nomor = ?',
        [plat_nomor]
      );
      return rows[0]; // Return first result atau undefined
    } catch (error) {
      throw error;
    }
  },

  // Buat kendaraan baru
  create: async (data) => {
    try {
      const { plat_nomor, jenis_kendaraan } = data;
      const [result] = await db.query(
        'INSERT INTO tablekendaraan (plat_nomor, jenis_kendaraan) VALUES (?, ?)',
        [plat_nomor, jenis_kendaraan]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Ambil semua kendaraan
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM tablekendaraan');
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = KendaraanModel;