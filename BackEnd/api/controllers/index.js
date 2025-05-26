const express = require("express");
const router = express.Router();
const authController = require("./auth/authController");
const messageController = require("./message/messageController");
const searchUserController = require("./search/searchUserController");
const userActionController = require("./user/userActionController");
const chatController = require("./chat/chatController");

module.exports = {
  authController,
  messageController,
  searchUserController,
  userActionController,
  chatController,
};
