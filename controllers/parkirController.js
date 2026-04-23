const KendaraanModel = require('../models/KendaraanModel');
const TarifModel = require('../models/TarifModel');
const ParkirModel = require('../models/ParkirModel');

const ParkirController = {
  // =====================
  // FITUR CHECK-IN
  // =====================
  checkIn: async (req, res) => {
    try {
      const { plat_nomor, jenis_kendaraan } = req.body;

      // 1. Validasi input
      if (!plat_nomor || !jenis_kendaraan) {
        return res.status(400).json({
          status: 400,
          message: 'Plat nomor dan jenis kendaraan wajib diisi',
          data: null
        });
      }

      // Validasi jenis kendaraan
      const jenisValid = ['motor', 'mobil'];
      if (!jenisValid.includes(jenis_kendaraan.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          message: 'Jenis kendaraan harus motor atau mobil',
          data: null
        });
      }

      // 2. Cek apakah kendaraan sudah ada yang sedang parkir
      const existingParkir = await ParkirModel.findByPlatNomorAktif(plat_nomor);
      if (existingParkir) {
        return res.status(400).json({
          status: 400,
          message: 'Kendaraan dengan plat nomor ini masih dalam status parkir aktif',
          data: {
            id_parkir: existingParkir.id_parkir,
            waktu_masuk: existingParkir.waktu_masuk,
            plat_nomor: existingParkir.plat_nomor
          }
        });
      }

      // 3. Cari atau buat data kendaraan
      let kendaraan = await KendaraanModel.findByPlatNomor(plat_nomor);
      
      if (!kendaraan) {
        // Kendaraan baru, buat record baru
        const id_kendaraan = await KendaraanModel.create({
          plat_nomor: plat_nomor.toUpperCase(),
          jenis_kendaraan: jenis_kendaraan.toLowerCase()
        });
        
        kendaraan = {
          Id_kendaraan: id_kendaraan,
          plat_nomor: plat_nomor.toUpperCase(),
          jenis_kendaraan: jenis_kendaraan.toLowerCase()
        };
      }

      // 4. Cari tarif berdasarkan jenis kendaraan
      const tarif = await TarifModel.findByJenisKendaraan(jenis_kendaraan.toLowerCase());
      
      if (!tarif) {
        return res.status(404).json({
          status: 404,
          message: `Tarif untuk jenis kendaraan ${jenis_kendaraan} tidak ditemukan`,
          data: null
        });
      }

      // 5. Buat record parkir baru
      const waktu_masuk = new Date();
      const id_parkir = await ParkirModel.create({
        id_kendaraan: kendaraan.Id_kendaraan,
        id_tarif: tarif.id_tarif,
        waktu_masuk: waktu_masuk
      });

      // 6. Response sukses
      return res.status(201).json({
        status: 201,
        message: 'Check-in berhasil',
        data: {
          id_parkir: id_parkir,
          plat_nomor: plat_nomor.toUpperCase(),
          jenis_kendaraan: jenis_kendaraan.toLowerCase(),
          waktu_masuk: waktu_masuk,
          tarif_perjam: tarif.tarif_perjam,
          tarif_maksimal: tarif.tarif_maksimal
        }
      });

    } catch (error) {
      console.error('Error check-in:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: error.message
      });
    }
  },

  // =====================
  // GET ALL PARKIR (Untuk testing)
  // =====================
  getAllParkir: async (req, res) => {
    try {
      const parkirs = await ParkirModel.getAll();
      
      return res.status(200).json({
        status: 200,
        message: 'Data parkir berhasil diambil',
        data: parkirs
      });
    } catch (error) {
      console.error('Error get all parkir:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: error.message
      });
    }
  },

  // =====================
  // GET PARKIR BY ID (Untuk testing)
  // =====================
  getParkirById: async (req, res) => {
    try {
      const { id } = req.params;
      const parkir = await ParkirModel.findById(id);

      if (!parkir) {
        return res.status(404).json({
          status: 404,
          message: 'Data parkir tidak ditemukan',
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Data parkir berhasil diambil',
        data: parkir
      });
    } catch (error) {
      console.error('Error get parkir by id:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: error.message
      });
    }
  }
};

module.exports = ParkirController;