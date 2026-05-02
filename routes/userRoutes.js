const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.post("/signIn", userController.signIn);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);

module.exports = router;