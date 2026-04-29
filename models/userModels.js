// models/userModel.js

const User = {
    // Cari user berdasarkan username (untuk login)
    findByUsername: async (db, username) => {
        const [rows] = await db.execute(
            "SELECT * FROM tabeluser WHERE username = ?",
            [username]
        );
        return rows;
    },

    // Ambil semua data user
    findAll: async (db) => {
        const [rows] = await db.execute(
            "SELECT id_user, username, name, role FROM tabeluser"
        );
        return rows;
    },

    // Tambah user baru
    create: async (db, userData) => {
        const { username, password, name, role } = userData;
        const [result] = await db.execute(
            "INSERT INTO tabeluser (username, password, name, role) VALUES (?, ?, ?, ?)",
            [username, password, name, role]
        );
        return result;
    },

    // Update data user
    update: async (db, id, userData) => {
        const { username, name, role } = userData;
        const [result] = await db.execute(
            "UPDATE tabeluser SET username = ?, name = ?, role = ? WHERE id_user = ?",
            [username, name, role, id]
        );
        return result;
    },

    // Hapus user
    delete: async (db, id) => {
        const [result] = await db.execute(
            "DELETE FROM tabeluser WHERE id_user = ?",
            [id]
        );
        return result;
    }
};

module.exports = User;