const express = require("express");
const { authController } = require("../../controllers/index");
const checkUser = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/verify", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/logout/:userId", checkUser, authController.logout);

module.exports = router;
