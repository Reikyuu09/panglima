const db = require('../config/db'); 

const getRiwayatParkir = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM kendaraan_parkir';
        let queryParams = [];

        if (startDate && endDate) {
            sql += ' WHERE tanggal_masuk BETWEEN ? AND ?';
            queryParams.push(startDate, endDate);
        }

        db.query(sql, queryParams, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    getRiwayatParkir
};