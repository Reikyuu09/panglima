const reportModel = require('../models/RiwayatParkir');

const ambilRiwayat = async (req, res) => {
    try {
        // Tangkap tanggal dari URL (misal: ?startDate=2023-10-01&endDate=2023-10-31)
        const { startDate, endDate } = req.query;

        // Panggil model yang udah kita bikin di Tahap 1
        const dataParkir = await reportModel.getRiwayatParkir(startDate, endDate);

        // Kalau sukses, kirim datanya
        res.status(200).json({
            status: 'success',
            pesan: 'Berhasil mengambil riwayat parkir',
            total_data: dataParkir.length,
            data: dataParkir
        });

    } catch (error) {
        // Kalau error database, kasih tau
        res.status(500).json({
            status: 'error',
            pesan: 'Terjadi kesalahan di server',
            error: error.message
        });
    }
};

module.exports = {
    ambilRiwayat
};