const db = require('../config/database');

const getRiwayatParkir = async (startDate, endDate) => {
    let sql = `
        SELECT 
            p.id_parkir,
            k.plat_nomor,
            k.jenis_kendaraan,
            p.waktu_masuk,
            p.waktu_keluar,
            p.durasi_jam,
            p.total_biaya,
            p.status,
            py.jumlah_bayar,
            py.metode_pembayaran
        FROM tableparkir p
        LEFT JOIN tablekendaraan k ON p.id_kendaraan = k.Id_kendaraan
        LEFT JOIN tablepembayaran py ON p.id_parkir = py.id_parkir
    `;
    const queryParams = [];

    if (startDate && endDate) {
        sql += ' WHERE DATE(p.waktu_masuk) BETWEEN ? AND ?';
        queryParams.push(startDate, endDate);
    }

    sql += ' ORDER BY p.id_parkir DESC';

    const [results] = await db.query(sql, queryParams);
    return results;
};

module.exports = {
    getRiwayatParkir
};