const express = require("express");
const { chatController } = require("../../controllers/index");
const checkUser = require("../../middlewares/authMiddleware");

const router = express.Router();

// get or create new chat Id
router.post("/getOrCreateChatId", checkUser, chatController.getorcreate);

module.exports = router;
