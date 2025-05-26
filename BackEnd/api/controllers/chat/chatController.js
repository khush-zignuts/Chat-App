const { Op } = require("sequelize");
const { Chat } = require("../../models/index");
const { HTTP_STATUS_CODES } = require("../../config/constant");

// POST /api/chats/get-or-create
const getorcreate = async (req, res) => {
  try {
    let { user1Id, user2Id } = req.body;

    if (user1Id > user2Id) {
      [user1Id, user2Id] = [user2Id, user1Id];
    }

    let chat = await Chat.findOne({
      where: {
        user1Id: user1Id,
        user2Id: user2Id,
      },
    });

    if (!chat) {
      chat = await Chat.create({
        user1Id,
        user2Id,
        createdAt: Math.floor(Date.now() / 1000),
        createdBy: user1Id,
      });

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        status: HTTP_STATUS_CODES.CREATED,
        message: "Chat created successfully.",
        data: chat,
        error: "",
      });
    } else {
      return res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Chat fetched successfully.",
        data: chat,
        error: "",
      });
    }
  } catch (error) {
    console.error("Chat get-or-create error:", error);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.SERVER_ERROR,
      message: "Failed to get or create chat",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getorcreate,
};
