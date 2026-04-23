const db = require('../config/database');

const ParkirModel = {
  // Buat record parkir baru (Check-In)
  create: async (data) => {
    try {
      const { id_kendaraan, id_tarif, waktu_masuk } = data;
      const [result] = await db.query(
        'INSERT INTO tableparkir (id_kendaraan, id_tarif, waktu_masuk, status) VALUES (?, ?, ?, ?)',
        [id_kendaraan, id_tarif, waktu_masuk || new Date(), 'parkir']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Cek apakah kendaraan sedang parkir aktif
  findByPlatNomorAktif: async (plat_nomor) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, k.plat_nomor, k.jenis_kendaraan, t.tarif_perjam, t.tarif_maksimal
        FROM tableparkir p
        JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        JOIN tabletarif t ON p.id_tarif = t.id_tarif
        WHERE k.plat_nomor = ? AND p.status = 'parkir'
      `, [plat_nomor]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Ambil semua data parkir dengan join
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
      throw error;
    }
  },

  // Cari parkir berdasarkan ID
  findById: async (id_parkir) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, k.plat_nomor, k.jenis_kendaraan, t.tarif_perjam
        FROM tableparkir p
        JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        JOIN tabletarif t ON p.id_tarif = t.id_tarif
        WHERE p.id_parkir = ?
      `, [id_parkir]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ParkirModel;