const express = require("express");
const router = express.Router();
const { User } = require("../../models/index"); // Your User model
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { HTTP_STATUS_CODES } = require("../../config/constant");

const getUser = async (req, res) => {
  try {
    const userId = req.user.dataValues.id;
    // Fetch the current user based on the provided token
    const user = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["id"],
    });

    // Check if user exists
    if (!user) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: false,
        message: "User not found",
        data: "",
        error: "USER_NOT_FOUND",
      });
    }

    // Fetch all users except the logged-in user
    const users = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: req.user.id,
        },
      },
      attributes: ["id", "name", "email", "status", "profilePic", "isOnline"],
    });

    if (users && users.length > 0) {
      return res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Users fetched successfully",
        data: users,
        error: "",
      });
    } else {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "No users found.",
        data: "",
        error: "NO_USERS_FOUND",
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: false,
      message: "Server error while fetching users",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

const getLoginUser = async (req, res) => {
  try {
    const userid = req.user.dataValues.id;

    const user = await User.findOne({
      where: {
        id: userid,
      },
      attributes: ["id", "name", "email", "status", "profilePic", "isOnline"],
    });

    if (user) {
      return res.status(HTTP_STATUS_CODES.OK).json({
        status: true,
        message: "User fetched successfully",
        data: user,
        error: "",
      });
    } else {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: false,
        message: "User not found",
        data: "",
        error: "USER_NOT_FOUND",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: false,
      message: "Server error while fetching user",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("req.params: ", req.params);

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "name", "email", "status", "profilePic", "isOnline"],
    });
    console.log("user: ", user);

    if (!user) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "User not found",
        data: "",
        error: "USER_NOT_FOUND",
      });
    }

    return res.status(HTTP_STATUS_CODES.OK).json({
      status: HTTP_STATUS_CODES.OK,
      message: "User fetched successfully",
      data: user,
      error: "",
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.SERVER_ERROR,
      message: "Server error while fetching user by ID",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Update Request Params:", req.params);
    console.log("Update Body:", req.body);

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        status: HTTP_STATUS_CODES.NOT_FOUND,
        message: "User not found",
        data: "",
        error: "USER_NOT_FOUND",
      });
    }

    const { name, status, profilePic } = req.body;

    // Update fields only if they are provided
    if (name !== undefined) user.name = name;
    if (status !== undefined) user.status = status;
    if (profilePic !== undefined) user.profilePic = profilePic;

    await user.save();

    // Return updated user (excluding sensitive fields)
    return res.status(HTTP_STATUS_CODES.OK).json({
      status: HTTP_STATUS_CODES.OK,
      message: "User updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
      },
      error: "",
    });
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
      status: HTTP_STATUS_CODES.SERVER_ERROR,
      message: "Server error while updating user",
      data: "",
      error: error.message || "Internal server error",
    });
  }
};

module.exports = {
  getUser,
  getLoginUser,
  getUserById,
  updateUserById,
};
