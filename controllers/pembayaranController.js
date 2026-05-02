const PembayaranModel = require('../models/PembayaranModels');
const ParkirModel = require('../models/ParkirModel');
const db = require('../config/database');

const PembayaranController = {
  // Proses Pembayaran
  prosesPembayaran: async (req, res) => {
    try {
      const { id_parkir, id_user, metode_pembayaran, jumlah_bayar } = req.body;

      // 1. Validasi input
      if (!id_parkir || !metode_pembayaran || !jumlah_bayar) {
        return res.status(400).json({
          status: 400,
          message: 'ID parkir, metode pembayaran, dan jumlah bayar wajib diisi',
          data: null
        });
      }

      // 2. Validasi metode pembayaran
      const metodeValid = ['tunai', 'qris', 'e-wallet'];
      if (!metodeValid.includes(metode_pembayaran.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          message: 'Metode pembayaran harus tunai, qris, atau e-wallet',
          data: null
        });
      }

      // 3. Cek data parkir
      const parkir = await ParkirModel.findById(id_parkir);
      
      if (!parkir) {
        return res.status(404).json({
          status: 404,
          message: 'Data parkir tidak ditemukan',
          data: null
        });
      }

      // 4. Cek apakah sudah dibayar
      const existingPembayaran = await PembayaranModel.findByParkirId(id_parkir);
      if (existingPembayaran) {
        return res.status(400).json({
          status: 400,
          message: 'Pembayaran untuk parkir ini sudah dilakukan',
          data: existingPembayaran
        });
      }

      // 5.  HITUNG TOTAL BIAYA OTOMATIS (Jika masih NULL/0)
      let totalBiaya = parseInt(parkir.total_biaya);
      
      if (!totalBiaya || totalBiaya === 0) {
        // Ambil tarif sesuai id_tarif dari database
        const [tarifRows] = await db.query(
          'SELECT tarif_perjam, tarif_maksimal FROM tabletarif WHERE id_tarif = ?',
          [parkir.id_tarif]
        );

        let tarifPerJam = 2000;   // Default fallback
        let tarifMaksimal = 20000; // Default fallback

        if (tarifRows && tarifRows.length > 0) {
          tarifPerJam = parseInt(tarifRows[0].tarif_perjam);
          tarifMaksimal = parseInt(tarifRows[0].tarif_maksimal);
        }

        // Hitung durasi parkir
        const waktuMasuk = new Date(parkir.waktu_masuk);
        const waktuKeluar = new Date();
        const durasiMs = waktuKeluar - waktuMasuk;
        let durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60));
        if (durasiJam < 1) durasiJam = 1; // Minimal 1 jam

        // Hitung total biaya
        totalBiaya = durasiJam * tarifPerJam;

        //  Capping: Jangan melebihi tarif maksimal harian
        if (totalBiaya > tarifMaksimal) {
          totalBiaya = tarifMaksimal;
        }

        // Update tableparkir dengan data check-out
        await db.query(`
          UPDATE tableparkir 
          SET waktu_keluar = ?, durasi_jam = ?, total_biaya = ?, status = 'selesai'
          WHERE id_parkir = ?
        `, [waktuKeluar, durasiJam, totalBiaya, id_parkir]);
      }

      // 6. Hitung kembalian
      const bayar = parseInt(jumlah_bayar);
      
      if (bayar < totalBiaya) {
        return res.status(400).json({
          status: 400,
          message: `Jumlah bayar kurang. Total biaya: Rp ${totalBiaya.toLocaleString()}`,
          data: {
            total_biaya: totalBiaya,
            kurang: totalBiaya - bayar
          }
        });
      }

      const kembalian = bayar - totalBiaya;

      // 7. Create pembayaran
      const id_pembayaran = await PembayaranModel.create({
        id_parkir,
        id_user: id_user || null,
        jumlah_bayar: bayar,
        metode_pembayaran: metode_pembayaran.toLowerCase(),
        kembalian,
        status_pembayaran: 'lunas'
      });

      // 8. Response sukses
      return res.status(201).json({
        status: 201,
        message: 'Pembayaran berhasil',
        data: {
          id_pembayaran,
          id_parkir,
          plat_nomor: parkir.plat_nomor,
          total_biaya: totalBiaya,
          jumlah_bayar: bayar,
          kembalian,
          metode_pembayaran: metode_pembayaran.toLowerCase(),
          waktu_bayar: new Date()
        }
      });

    } catch (error) {
      console.error('Error proses pembayaran:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get all pembayaran
  getAllPembayaran: async (req, res) => {
    try {
      const pembayarans = await PembayaranModel.getAll();
      
      return res.status(200).json({
        status: 200,
        message: 'Data pembayaran berhasil diambil',
        count: pembayarans.length,
        data: pembayarans
      });
    } catch (error) {
      console.error('Error get all pembayaran:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get pembayaran by id_parkir
  getPembayaranByParkirId: async (req, res) => {
    try {
      const { id_parkir } = req.params;
      const pembayaran = await PembayaranModel.findByParkirId(id_parkir);

      if (!pembayaran) {
        return res.status(404).json({
          status: 404,
          message: 'Pembayaran tidak ditemukan',
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Data pembayaran berhasil diambil',
        data: pembayaran
      });
    } catch (error) {
      console.error('Error get pembayaran by id:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = PembayaranController;