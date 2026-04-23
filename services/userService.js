async function login(db, username, password) {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM tabeluser WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return { success: false, message: "Username mu tidak ditemukan" };
        }

        const user = rows[0];   

        if (user.password !== password) {
            return { success: false, message: "Password mu salah" };
        }

        return {
            success: true,
            message: "Login berhasil, silahkan masuk",
            data: {
                id_user: user.id_user,
                username: user.username,
                name: user.name,
                role: user.role
            }
        };

    } catch (error) {
        return {
            success: false,
            message: "Ada error nih, coba lagi nanti",
            error: error.message
        };
    }
}

module.exports = {
    login
};