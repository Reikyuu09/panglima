const reportModel = require('../models/RiwayatModels');

const ambilRiwayat = async (req, res) => {
    console.log('\n========================================');
    console.log('MENDAPAT REQUEST LAPORAN');
    console.log('Query params:', req.query);
    
    try {
        const { startDate, endDate } = req.query;

        // Validasi input
        if (!startDate || !endDate) {
            console.log('Validasi gagal: tanggal tidak lengkap');
            return res.status(400).json({
                status: 'error',
                pesan: 'startDate dan endDate wajib diisi',
                data: []
            });
        }

        console.log('Memanggil model getRiwayatParkir...');
        console.log('Start:', startDate, '| End:', endDate);

        // Panggil model
        const dataParkir = await reportModel.getRiwayatParkir(startDate, endDate);

        console.log('Model berhasil return data');
        console.log('Total rows:', dataParkir.length);
        console.log('========================================\n');

        // Kirim response
        res.status(200).json({
            status: 'success',
            pesan: 'Berhasil mengambil riwayat parkir',
            total_data: dataParkir.length,
            data: dataParkir
        });

    } catch (error) {
        console.error('\n========================================');
        console.error('ERROR DI CONTROLLER:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('========================================\n');
        
        res.status(500).json({
            status: 'error',
            pesan: 'Terjadi kesalahan di server',
            error: error.message,
            data: []
        });
    }
};

module.exports = {
    ambilRiwayat
};