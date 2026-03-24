const express = require('express');
const router = express.Router();

// Endpoint sederhana
router.get('/test', (req, res) => {
    res.json({
        status: 200,
        message: "API Routes Berhasil!"
    });
});

module.exports = router;