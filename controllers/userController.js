const userService = require("../services/userService");
const db = require("../config/database");

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        const result = await userService.login(db, username, password);

        if (!result.success) {
            return res.status(401).json(result);
        }

        return res.json(result);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

async function signIn(req, res) {
    try {
        const { username, password, name, role } = req.body;

        if (!username || !password || !name || !role) {
            return res.status(400).json({
                success: false,
                message: "Semua data (username, password, name, role) wajib diisi"
            });
        }

        const result = await userService.createUser(db, { username, password, name, role });
        
        return res.status(201).json({
            success: true,
            message: "User berhasil didaftarkan",
            userId: result.insertId
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Gagal melakukan pendaftaran user",
            error: error.message
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const UserModel = require("../models/userModels");
        const users = await UserModel.findAll();
        
        return res.status(200).json({
            success: true,
            message: "Data user berhasil diambil",
            data: users
        });
    } catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const UserModel = require("../models/userModels");
        const result = await UserModel.delete(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User berhasil dihapus',
            data: null
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                success: false,
                message: 'User tidak dapat dihapus karena masih memiliki data transaksi'
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
}

module.exports = {
    login,
    signIn,
    getAllUsers,
    deleteUser
};