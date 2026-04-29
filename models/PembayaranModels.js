const db = require('../config/database');

const PembayaranModel = {
  // Create pembayaran
  create: async (data) => {
    try {
      const { id_parkir, id_user, jumlah_bayar, metode_pembayaran, kembalian, status_pembayaran } = data;
      const [result] = await db.query(
        `INSERT INTO tablepembayaran 
         (id_parkir, id_user, jumlah_bayar, metode_pembayaran, waktu_bayar, kembalian, status_pembayaran) 
         VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [id_parkir, id_user, jumlah_bayar, metode_pembayaran, kembalian, status_pembayaran || 'lunas']
      );
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating pembayaran: ${error.message}`);
    }
  },

  // Get pembayaran by id_parkir
  findByParkirId: async (id_parkir) => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, u.username, u.name as user_name
        FROM tablepembayaran p
        LEFT JOIN tabeluser u ON p.id_user = u.id_user
        WHERE p.id_parkir = ?
      `, [id_parkir]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding pembayaran: ${error.message}`);
    }
  },

  // Get all pembayaran
  getAll: async () => {
    try {
      const [rows] = await db.query(`
        SELECT p.*, 
               pk.plat_nomor, 
               pk.jenis_kendaraan,
               pr.waktu_masuk,
               pr.waktu_keluar,
               pr.durasi_jam,
               pr.total_biaya as biaya_parkir,
               u.username,
               u.name as user_name
        FROM tablepembayaran p
        JOIN tableparkir pr ON p.id_parkir = pr.id_parkir
        JOIN tablekendaraan pk ON pr.id_kendaraan = pk.Id_kendaraan
        LEFT JOIN tabeluser u ON p.id_user = u.id_user
        ORDER BY p.waktu_bayar DESC
      `);
      return rows;
    } catch (error) {
      throw new Error(`Error getting all pembayaran: ${error.message}`);
    }
  }
};

module.exports = PembayaranModel;