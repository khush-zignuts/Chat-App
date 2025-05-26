const express = require("express");
const { messageController } = require("../../controllers/index");
const checkUser = require("../../middlewares/authMiddleware");
const upload = require("../../utils/multer"); // multer with memoryStorage
const router = express.Router();

// Send a message
router.post(
  "/send",
  upload.single("image"),
  checkUser,
  messageController.saveMessage
);

// Get all messages between two users
router.get("/get/:chatId", checkUser, messageController.getMessages);

//update message:
router.put(
  "/update/:editingMessageId",
  checkUser,
  messageController.updateMessage
);

// Delete a specific message
router.delete("/delete/:messageId", checkUser, messageController.deleteMessage);

module.exports = router;
