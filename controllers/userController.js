const userService = require("../services/userService");
const UserModel = require("../models/userModels");
const db = require("../config/database");
// ❌ HAPUS: const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username dan password wajib diisi"
            });
        }

        // Cari user by username
        const user = await UserModel.findByUsername(username);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        // ✅ Bandingkan password PLAIN TEXT (tanpa bcrypt)
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Username atau password salah"
            });
        }

        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { 
                id_user: user.id_user,
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'parkink-secret',
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            message: "Login berhasil",
            data: {
                user: {
                    id_user: user.id_user,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    foto: user.foto
                },
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
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

        // ✅ Simpan password PLAIN TEXT (tanpa hash)
        const result = await userService.createUser(db, { 
            username, 
            password,  // Langsung simpan, jangan di-hash
            name, 
            role 
        });
        
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

async function createPetugas(req, res) {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang bisa menambah petugas."
            });
        }

        const { username, password, name, role } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Username, password, dan nama wajib diisi"
            });
        }

        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }

        // ✅ Simpan password PLAIN TEXT
        const foto = req.file ? req.file.filename : null;

        const [result] = await db.query(
            'INSERT INTO tabeluser (username, password, name, role, foto) VALUES (?, ?, ?, ?, ?)',
            [username, password, name, role || 'petugas', foto]  // Langsung simpan password
        );

        const newUser = await UserModel.findById(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Petugas berhasil ditambahkan",
            data: newUser
        });
    } catch (error) {
        console.error('Error createPetugas:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Gagal menambah petugas",
            error: error.message
        });
    }
}

async function updatePetugas(req, res) {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang bisa mengupdate petugas."
            });
        }

        const { id } = req.params;
        const { username, password, name, role } = req.body;

        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan"
            });
        }

        if (username && username !== existingUser.username) {
            const userWithUsername = await UserModel.findByUsername(username);
            if (userWithUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username sudah digunakan"
                });
            }
        }

        const updateData = {
            username: username || existingUser.username,
            name: name || existingUser.name,
            role: role || existingUser.role,
            password: existingUser.password  // Pakai password lama
        };

        // ✅ Jika ada password baru, simpan PLAIN TEXT (tanpa hash)
        if (password && password.trim() !== '') {
            updateData.password = password;  // Langsung simpan
        }

        if (req.file) {
            if (existingUser.foto) {
                const oldFotoPath = path.join(__dirname, '../uploads', existingUser.foto);
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath);
                }
            }
            updateData.foto = req.file.filename;
        } else {
            updateData.foto = existingUser.foto;
        }

        await UserModel.update(id, updateData);
        const updatedUser = await UserModel.findById(id);

        return res.status(200).json({
            success: true,
            message: "Petugas berhasil diupdate",
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updatePetugas:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: "Username sudah digunakan"
            });
        }
        
        return res.status(500).json({
            success: false,
            message: "Gagal mengupdate petugas",
            error: error.message
        });
    }
}

async function deleteUser(req, res) {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak. Hanya admin yang bisa menghapus user."
            });
        }

        const { id } = req.params;

        if (req.user.id_user && parseInt(id) === parseInt(req.user.id_user)) {
            return res.status(400).json({
                success: false,
                message: "Tidak bisa menghapus akun sendiri"
            });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }

        if (user.foto) {
            const fotoPath = path.join(__dirname, '../uploads', user.foto);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

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
    createPetugas,
    updatePetugas,
    deleteUser
};