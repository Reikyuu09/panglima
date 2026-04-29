const KendaraanModel = require('../models/KendaraanModel');
const TarifModel = require('../models/TarifModel');
const ParkirModel = require('../models/ParkirModel');

const ParkirController = {
  // =====================
  // CHECK-IN (INPUT KENDARAAN MASUK)
  // =====================
  checkIn: async (req, res) => {
    try {
      const { plat_nomor, jenis_kendaraan } = req.body;

      // 1. Cek apakah kendaraan sudah ada yang sedang parkir
      const existingParkir = await ParkirModel.findByPlatNomorAktif(plat_nomor);
      if (existingParkir) {
        return res.status(400).json({
          status: 400,
          message: 'Kendaraan masih dalam status parkir aktif',
          data: {
            id_parkir: existingParkir.id_parkir,
            plat_nomor: existingParkir.plat_nomor,
            waktu_masuk: existingParkir.waktu_masuk,
            jenis_kendaraan: existingParkir.jenis_kendaraan
          }
        });
      }

      // 2. Cari atau buat data kendaraan
      let kendaraan = await KendaraanModel.findByPlatNomor(plat_nomor);
      
      if (!kendaraan) {
        // Kendaraan baru, buat record
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

      // 3. Cari tarif berdasarkan jenis kendaraan
      const tarif = await TarifModel.findByJenisKendaraan(jenis_kendaraan);
      
      if (!tarif) {
        return res.status(404).json({
          status: 404,
          message: `Tarif untuk jenis kendaraan ${jenis_kendaraan} tidak ditemukan`,
          data: null
        });
      }

      // 4. Buat record parkir baru
      const waktu_masuk = new Date();
      const id_parkir = await ParkirModel.create({
        id_kendaraan: kendaraan.Id_kendaraan,
        id_tarif: tarif.id_tarif,
        waktu_masuk: waktu_masuk
      });

      // 5. Response sukses
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================
  // GET ALL PARKIR
  // =====================
  getAllParkir: async (req, res) => {
    try {
      const parkirs = await ParkirModel.getAll();
      
      return res.status(200).json({
        status: 200,
        message: 'Data parkir berhasil diambil',
        count: parkirs.length,
        data: parkirs
      });
    } catch (error) {
      console.error('Error get all parkir:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================
  // GET PARKIR BY ID
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
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================
  // CRUD KENDARAAN - CREATE
  // =====================
  createKendaraan: async (req, res) => {
    try {
      const { plat_nomor, jenis_kendaraan } = req.body;

      // Cek apakah plat nomor sudah terdaftar
      const existing = await KendaraanModel.findByPlatNomor(plat_nomor);
      if (existing) {
        return res.status(409).json({
          status: 409,
          message: 'Kendaraan dengan plat nomor ini sudah terdaftar',
          data: null
        });
      }

      const id_kendaraan = await KendaraanModel.create({
        plat_nomor: plat_nomor.toUpperCase(),
        jenis_kendaraan: jenis_kendaraan.toLowerCase()
      });

      return res.status(201).json({
        status: 201,
        message: 'Kendaraan berhasil ditambahkan',
        data: { id_kendaraan }
      });
    } catch (error) {
      console.error('Error create kendaraan:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================
  // CRUD KENDARAAN - GET ALL
  // =====================
  getAllKendaraan: async (req, res) => {
    try {
      const kendaraans = await KendaraanModel.getAll();
      
      return res.status(200).json({
        status: 200,
        message: 'Data kendaraan berhasil diambil',
        count: kendaraans.length,
        data: kendaraans
      });
    } catch (error) {
      console.error('Error get all kendaraan:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================
  // CRUD KENDARAAN - UPDATE
  // =====================
  updateKendaraan: async (req, res) => {
    try {
      const { id } = req.params;
      const { plat_nomor, jenis_kendaraan } = req.body;

      // Cek apakah kendaraan ada
      const existing = await KendaraanModel.findByPlatNomor(plat_nomor);
      if (existing && existing.Id_kendaraan != id) {
        return res.status(409).json({
          status: 409,
          message: 'Plat nomor sudah digunakan kendaraan lain',
          data: null
        });
      }

      const affected = await KendaraanModel.update(id, {
        plat_nomor,
        jenis_kendaraan
      });

      if (affected === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Kendaraan tidak ditemukan',
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Kendaraan berhasil diupdate',
        data: null
      });
    } catch (error) {
      console.error('Error update kendaraan:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    // Contoh fungsi checkOut
    const durasi = Math.ceil((new Date(waktu_keluar) - new Date(waktu_masuk)) / (1000 * 60 * 60));
    const biaya = durasi * tarifPerJam;

    await db.query(`
      UPDATE tableparkir 
      SET waktu_keluar = ?, durasi_jam = ?, total_biaya = ?, status = 'selesai'
      WHERE id_parkir = ?
    `, [waktu_keluar, durasi, biaya, id_parkir]);
  },

  // =====================
  // CRUD KENDARAAN - DELETE
  // =====================
  deleteKendaraan: async (req, res) => {
    try {
      const { id } = req.params;
      const affected = await KendaraanModel.delete(id);

      if (affected === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Kendaraan tidak ditemukan',
          data: null
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'Kendaraan berhasil dihapus',
        data: null
      });
    } catch (error) {
      console.error('Error delete kendaraan:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  // =====================
  // KENDARAAN KELUAR & HITUNG BIAYA
  // =====================
  keluar: async (req, res) => {
    try {
      const { id_parkir } = req.body;

      // 1. Ambil data parkir
      const parkir = await ParkirModel.findById(id_parkir);

      if (!parkir) {
        return res.status(404).json({
          status: 404,
          message: 'Data parkir tidak ditemukan',
          data: null
        });
      }

      if (parkir.status === 'selesai') {
        return res.status(400).json({
          status: 400,
          message: 'Kendaraan sudah keluar sebelumnya',
          data: null
        });
      }

      // 2. Hitung durasi
      const waktuMasuk = new Date(parkir.waktu_masuk);
      const waktuSekarang = new Date();

      let durasi = Math.ceil((waktuSekarang - waktuMasuk) / (1000 * 60 * 60));

      // 3. Hitung biaya
      let total = durasi * parkir.tarif_perjam;

      if (parkir.tarif_maksimal && total > parkir.tarif_maksimal) {
        total = parkir.tarif_maksimal;
      }

      // 4. Update database
      await ParkirModel.update(id_parkir, durasi, total);

      // 5. Response
      return res.status(200).json({
        status: 200,
        message: 'Kendaraan keluar berhasil',
        data: {
          id_parkir,
          plat_nomor: parkir.plat_nomor,
          jenis_kendaraan: parkir.jenis_kendaraan,
          waktu_masuk: parkir.waktu_masuk,
          waktu_keluar: waktuSekarang,
          durasi_jam: durasi,
          total_biaya: total
        }
      });

    } catch (error) {
      console.error('Error kendaraan keluar:', error);
      return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
};

  

module.exports = ParkirController;