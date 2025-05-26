const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Import DB connection
const CommonFields = require("./commonField");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user1_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user2_id",
      references: {
        model: "users",
        key: "id",
      },
    },

    ...CommonFields,
  },
  {
    tableName: "chats",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Chat;
