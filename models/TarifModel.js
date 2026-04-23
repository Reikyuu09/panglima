const db = require('../config/database');

const TarifModel = {
  // Cari tarif berdasarkan jenis kendaraan
  findByJenisKendaraan: async (jenis_kendaraan) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabletarif WHERE jenis_kendaraan = ? AND status = "aktif"',
        [jenis_kendaraan]
      );
      return rows[0]; // Return first result atau undefined
    } catch (error) {
      throw error;
    }
  },

  // Ambil semua tarif aktif
  getAll: async () => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabletarif WHERE status = "aktif"'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = TarifModel;