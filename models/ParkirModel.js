const db = require('../config/database');

const ParkirModel = {
  // Create new parkir record (Check-In)
  create: async (data) => {
    try {
      const { id_kendaraan, id_tarif, waktu_masuk } = data;
      const [result] = await db.query(
        'INSERT INTO tableparkir (id_kendaraan, id_tarif, waktu_masuk, status) VALUES (?, ?, ?, ?)',
        [id_kendaraan, id_tarif, waktu_masuk || new Date(), 'parkir']
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating parkir record: ${error.message}`);
    }
  },

  // Find active parkir by plat nomor
  findByPlatNomorAktif: async (plat_nomor) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, k.plat_nomor, k.jenis_kendaraan, t.tarif_perjam, t.tarif_maksimal
        FROM tableparkir p
        JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        JOIN tabletarif t ON p.id_tarif = t.id_tarif
        WHERE k.plat_nomor = ? AND p.status = 'parkir'
        ORDER BY p.waktu_masuk DESC
        LIMIT 1
      `, [plat_nomor.toUpperCase()]);
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding active parkir: ${error.message}`);
    }
  },

  // Get all parkir with details
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, k.plat_nomor, k.jenis_kendaraan, t.tarif_perjam
        FROM tableparkir p
        JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        JOIN tabletarif t ON p.id_tarif = t.id_tarif
        ORDER BY p.waktu_masuk DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error getting all parkir: ${error.message}`);
    }
  },

  // Find parkir by ID
  findById: async (id_parkir) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, k.plat_nomor, k.jenis_kendaraan, t.tarif_perjam, t.tarif_maksimal
        FROM tableparkir p
        JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        JOIN tabletarif t ON p.id_tarif = t.id_tarif
        WHERE p.id_parkir = ?
      `, [id_parkir]);
      
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding parkir by ID: ${error.message}`);
    }
  },

  // Update parkir (for check-out)
  update: async (id_parkir, data) => {
    try {
      const { waktu_keluar, durasi_jam, total_biaya, status } = data;
      const [result] = await db.query(
        `UPDATE tableparkir 
         SET waktu_keluar = ?, durasi_jam = ?, total_biaya = ?, status = ?
         WHERE id_parkir = ?`,
        [waktu_keluar, durasi_jam, total_biaya, status, id_parkir]
      );
      return result.affectedRows;
    } catch (error) {
      throw new Error(`Error updating parkir: ${error.message}`);
    }
  }
};

module.exports = ParkirModel;