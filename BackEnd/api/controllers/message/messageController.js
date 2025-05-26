const { Message } = require("../../models/index");
const { HTTP_STATUS_CODES } = require("../../config/constant");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../../config/db");
const cloudinary = require("../../config/cloudinary");
const streamifier = require("streamifier");

const saveMessage = async (req, res) => {
  try {
    const { chatId, senderId, receiverId, message } = req.body;

    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "chat_images" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      try {
        const result = await streamUpload(req.file.buffer);
        console.log("result.secure_url: ", result.secure_url);
        const savedMessage = await Message.create({
          chatId,
          senderId,
          receiverId,
          content: message,
          image: result.secure_url,
        });

        return res.status(HTTP_STATUS_CODES.CREATED).json({
          status: HTTP_STATUS_CODES.CREATED,
          message: "Message sent successfully.",
          data: savedMessage,
          error: "",
        });
      } catch (cloudError) {
        console.error("Cloudinary upload error:", cloudError);
        return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
          status: HTTP_STATUS_CODES.SERVER_ERROR,
          message: "Image upload failed.",
          data: "",
          error: cloudError.message || "Cloudinary error",
        });
      }
    } else {
      const savedMessage = await Message.create({
        chatId,
        senderId,
        receiverId,
        content: message,
      });

      return res.status(HTTP_STATUS_CODES.CREATED).json({
        status: HTTP_STATUS_CODES.CREATED,
        message: "Message sent successfully.",
        data: savedMessage,
        error: "",
      });
    }
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.SERVER_ERROR,
      message: "Failed to send message.",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const rawquery = `
    SELECT 
      m.id,
      m.sender_id AS "senderId",
      m.receiver_id AS "receiverId",
      m.content AS message,
      m.image AS image,
      m.created_at,
      m.is_deleted
    FROM messages AS m
    WHERE chat_id = :chatId
    ORDER BY created_at ASC
  `;

    const replacements = { chatId };

    const messages = await sequelize.query(rawquery, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    return res.status(HTTP_STATUS_CODES.OK).json({
      status: HTTP_STATUS_CODES.OK,
      message: "Messages fetched successfully.",
      data: messages,
      error: "",
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.SERVER_ERROR,
      message: "Failed to fetch messages.",
      data: "",
      error: err.message || "Internal server error",
    });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { editingMessageId } = req.params;
    console.log("req.params: ", req.params);
    const { message } = req.body;

    const [updated] = await Message.update(
      { content: message },
      { where: { id: editingMessageId, is_deleted: false } }
    );

    console.log("updated: ", updated);
    if (updated === 0) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "Message not found or already deleted.",
        data: null,
        error: "NOT_FOUND",
      });
    }

    const updatedMessage = await Message.findOne({
      where: { id: editingMessageId, is_deleted: false },
    });

    return res.status(HTTP_STATUS_CODES.OK).json({
      status: HTTP_STATUS_CODES.OK,
      message: "Message updated successfully.",
      data: updatedMessage,
      error: "",
    });
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Failed to update message.",
      data: null,
      error: error.message || "INTERNAL_ERROR",
    });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    console.log("req.params: ", req.params);

    const message = await Message.findOne({
      where: { id: messageId },
      attributes: ["id", "isDeleted"],
    });

    if (!message) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "Message not found.",
        data: null,
        error: "MESSAGE_NOT_FOUND",
      });
    }

    // await Message.destroy({ where: { id: messageId, is_deleted: false } });

    message.isDeleted = true;
    await message.save();
    console.log("message: ", message);

    return res.status(HTTP_STATUS_CODES.OK).json({
      status: HTTP_STATUS_CODES.OK,
      message: "Message is deleted .",
      data: message,
      error: "",
    });
  } catch (error) {
    console.error("deleteMessage error:", error);

    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal server error.",
      data: null,
      error: error.message || "UNKNOWN_ERROR",
    });
  }
};

module.exports = {
  saveMessage,
  getMessages,
  deleteMessage,
  updateMessage,
};
