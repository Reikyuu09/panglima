const db = require('../config/database');

const PembayaranModel = {

  // CREATE PEMBAYARAN
  create: async (data) => {
    const {
      id_parkir,
      id_user,
      jumlah_bayar,
      metode_pembayaran,
      kembalian,
      status_pembayaran
    } = data;

    const [result] = await db.execute(
      `INSERT INTO tablepembayaran 
      (id_parkir, id_user, jumlah_bayar, metode_pembayaran, waktu_bayar, kembalian, status_pembayaran) 
      VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
      [
        id_parkir,
        id_user,
        jumlah_bayar,
        metode_pembayaran,
        kembalian,
        status_pembayaran
      ]
    );

    return result.insertId;
  },

  // CEK SUDAH BAYAR
  findByParkirId: async (id_parkir) => {
    const [rows] = await db.execute(
      `SELECT * FROM tablepembayaran WHERE id_parkir = ?`,
      [id_parkir]
    );

    return rows[0];
  }

};

module.exports = PembayaranModel;