const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/signIn", userController.signIn);

module.exports = router;