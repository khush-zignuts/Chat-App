const DataTypes = require("sequelize");
const sequelize = require("../config/db");
const CommonFields = require("./commonField");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "chat_id",
      references: {
        model: "chats",
        key: "id",
      },
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "sender_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "receiver_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "image",
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "delivered_at",
    },
    ...CommonFields,
  },
  {
    tableName: "messages",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Message;
