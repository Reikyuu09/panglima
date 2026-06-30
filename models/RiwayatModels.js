const db = require('../config/database');

const getRiwayatParkir = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        console.log('[MODEL] Start simple query...');
        
        // QUERY PALING SIMPLE - TANPA JOIN
        const sql = `
            SELECT 
                id_parkir,
                waktu_masuk,
                waktu_keluar,
                durasi_jam,
                total_biaya,
                status
            FROM tableparkir
            WHERE status = 'selesai'
            AND DATE(waktu_keluar) BETWEEN ? AND ?
            ORDER BY waktu_keluar DESC
            LIMIT 20
        `;

        console.log('[MODEL] SQL:', sql);
        console.log('[MODEL] Params:', [startDate, endDate]);

        db.query(sql, [startDate, endDate], (err, results) => {
            if (err) {
                console.error('[MODEL] Error:', err.message);
                return reject(err);
            }
            
            console.log('[MODEL] Success! Rows:', results.length);
            console.log('[MODEL] Sample:', results.slice(0, 2));
            resolve(results);
        });
    });
};

module.exports = {
    getRiwayatParkir
};