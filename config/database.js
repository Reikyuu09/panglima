require('dotenv').config();
const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'db_parkir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error(' Gagal koneksi ke database:', err.message);
  } else {
    console.log(' Terhubung ke database db_parkir');
    connection.release();
  }
});

// Export promise wrapper
module.exports = pool.promise();