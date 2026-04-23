// controllers/userController.js

const userService = require("../services/userService");
const db = require("../db");

// Controller login
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // validasi input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        // panggil service
        const result = await userService.login(db, username, password);

        // kalau gagal
        if (!result.success) {
            return res.status(401).json(result);
        }

        // kalau berhasil
        return res.json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

module.exports = {
    login
};