const db = require("../config/database"); // sesuaikan kalau beda

exports.prosesPembayaran = async (req, res) => {
  try {
    const { id_parkir, jumlah_bayar, metode_pembayaran, id_user } = req.body;

    // 1. Ambil data parkir
    const [parkir] = await db.query(
      "SELECT total_biaya FROM parkir WHERE id = ?",
      [id_parkir]
    );

    if (parkir.length === 0) {
      return res.status(404).json({ message: "Data parkir tidak ditemukan" });
    }

    const total = parkir[0].total_biaya;

    // 2. Validasi pembayaran
    if (jumlah_bayar < total) {
      return res.status(400).json({ message: "Uang tidak cukup" });
    }

    // 3. Hitung kembalian
    const kembalian = jumlah_bayar - total;

    // 4. Simpan ke tabel pembayaran
    await db.query(
      `INSERT INTO pembayaran 
      (id_parkir, id_user, jumlah_bayar, metode_pembayaran, kembalian, status) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id_parkir, id_user, jumlah_bayar, metode_pembayaran, kembalian, "lunas"]
    );

    // 5. Update status parkir (optional tapi bagus)
    await db.query(
      "UPDATE parkir SET status = 'selesai' WHERE id = ?",
      [id_parkir]
    );

    // 6. Response
    res.json({
      message: "Pembayaran berhasil",
      total_biaya: total,
      jumlah_bayar,
      kembalian
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};