const PembayaranModel = require('../models/PembayaranModels');
const ParkirModel = require('../models/ParkirModel');
const db = require('../config/database');

const PembayaranController = {
  prosesPembayaran: async (req, res) => {
    try {
      const { id_parkir, id_user, metode_pembayaran, jumlah_bayar } = req.body;

      if (!id_parkir || !metode_pembayaran || !jumlah_bayar) {
        return res.status(400).json({
          status: 400,
          message: 'ID parkir, metode pembayaran, dan jumlah bayar wajib diisi',
          data: null
        });
      }

      const metodeValid = ['tunai', 'qris', 'e-wallet'];
      if (!metodeValid.includes(metode_pembayaran.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          message: 'Metode pembayaran harus tunai, qris, atau e-wallet',
          data: null
        });
      }

      const parkir = await ParkirModel.findById(id_parkir);
      
      if (!parkir) {
        return res.status(404).json({
          status: 404,
          message: 'Data parkir tidak ditemukan',
          data: null
        });
      }

      const existingPembayaran = await PembayaranModel.findByParkirId(id_parkir);
      if (existingPembayaran) {
        return res.status(400).json({
          status: 400,
          message: 'Pembayaran untuk parkir ini sudah dilakukan',
          data: existingPembayaran
        });
      }

      let totalBiaya = parseInt(parkir.total_biaya);
      
      if (!totalBiaya || totalBiaya === 0) {
        const [tarifRows] = await db.query(
          'SELECT tarif_perjam, tarif_maksimal FROM tabletarif WHERE id_tarif = ?',
          [parkir.id_tarif]
        );

        let tarifPerJam = 2000;
        let tarifMaksimal = 20000;

        if (tarifRows && tarifRows.length > 0) {
          tarifPerJam = parseInt(tarifRows[0].tarif_perjam);
          tarifMaksimal = parseInt(tarifRows[0].tarif_maksimal);
        }

        const waktuMasuk = new Date(parkir.waktu_masuk);
        const waktuKeluar = new Date();
        const durasiMs = waktuKeluar - waktuMasuk;
        let durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60));
        
        if (durasiJam < 1) {
          durasiJam = 1;
        }

        totalBiaya = durasiJam * tarifPerJam;

        if (totalBiaya > tarifMaksimal) {
          totalBiaya = tarifMaksimal;
        }

        const waktuKeluarFormatted = waktuKeluar.toISOString().slice(0, 19).replace('T', ' ');
        
        await db.query(`
          UPDATE tableparkir 
          SET waktu_keluar = ?, durasi_jam = ?, total_biaya = ?, status = 'selesai'
          WHERE id_parkir = ?
        `, [waktuKeluarFormatted, durasiJam, totalBiaya, id_parkir]);
      }

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

      const waktuBayar = new Date();
      const waktuBayarFormatted = waktuBayar.toISOString().slice(0, 19).replace('T', ' ');
      
      const id_pembayaran = await PembayaranModel.create({
        id_parkir,
        id_user: id_user || null,
        jumlah_bayar: bayar,
        metode_pembayaran: metode_pembayaran.toLowerCase(),
        kembalian,
        waktu_bayar: waktuBayarFormatted,
        status_pembayaran: 'lunas'
      });

      await ParkirModel.update(id_parkir, {
        waktu_keluar: waktuBayarFormatted,
        durasi_jam: Math.ceil(
          (new Date() - new Date(parkir.waktu_masuk))
          / (1000 * 60 * 60)
        ),
        total_biaya: totalBiaya,
        status: 'selesai'
      });

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
          waktu_bayar: waktuBayarFormatted
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