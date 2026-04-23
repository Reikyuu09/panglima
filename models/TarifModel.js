const db = require('../config/database');

const TarifModel = {
  // Find tarif by jenis kendaraan
  findByJenisKendaraan: async (jenis_kendaraan) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabletarif WHERE jenis_kendaraan = ? AND status = "aktif"',
        [jenis_kendaraan.toLowerCase()]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding tarif: ${error.message}`);
    }
  },

  // Get all active tarif
  getAll: async () => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabletarif WHERE status = "aktif" ORDER BY jenis_kendaraan'
      );
      return rows;
    } catch (error) {
      throw new Error(`Error getting all tarif: ${error.message}`);
    }
  },

  // Find tarif by ID
  findById: async (id_tarif) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM tabletarif WHERE id_tarif = ?',
        [id_tarif]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding tarif by ID: ${error.message}`);
    }
  }
};

module.exports = TarifModel;