const DataTypes = require("sequelize");
const sequelize = require("../config/db"); // Import DB connection
const CommonFields = require("./CommonField");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: "phone_number",
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "profile_pic",
    },
    accessToken: {
      type: DataTypes.TEXT,
      field: "access_token",
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    otpCreatedAt: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "otp_created_at",
    },
    isLogin: {
      type: DataTypes.BOOLEAN,
      field: "is_login",
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Hey there! I am using WhatsApp",
    },
    lastSeen: {
      type: DataTypes.BIGINT,
      defaultValue: DataTypes.NOW,
      field: "last_seen",
    },
    isOnline: {
      type: DataTypes.BOOLEAN,
      field: "is_online",
      defaultValue: false,
    },

    ...CommonFields,
  },
  {
    tableName: "users",
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = User;
