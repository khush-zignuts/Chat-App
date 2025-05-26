const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const VALIDATOR = require("validatorjs");

const { User } = require("../../models/index");

const sendEmail = require("../../utils/sendEmail");

const {
  HTTP_STATUS_CODES,
  OTP_EXPIRY,
  TOKEN_EXPIRY,
} = require("../../config/constant");
const { VALIDATION_RULES } = require("../../config/validationRules");

const cloudinary = require("../../config/cloudinary");

const verifyOTP = (enteredOtp, storedOtp, otpCreatedAt) => {
  const now = Math.floor(Date.now() / 1000);
  const createdAt = new Date(otpCreatedAt);
  const diffMinutes = (now - createdAt) / 1000 / 60;
  const isExpired = diffMinutes > OTP_EXPIRY.OTP_EXPIRY_MINUTES;

  return enteredOtp === storedOtp && !isExpired;
};

module.exports = {
  signup: async (req, res) => {
    try {
      const { email, password, name } = req.body;
      console.log("req.body: ", req.body);
      let { profilePic } = req.body;

      const validation = new VALIDATOR(req.body, {
        email: VALIDATION_RULES.USER.EMAIL,
        password: VALIDATION_RULES.USER.PASSWORD,
        name: VALIDATION_RULES.USER.NAME,
      });

      if (validation.fails()) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "Validation failed.",
          data: "",
          error: validation.errors.all(),
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({
        where: { email },
        isDeleted: false,
        attributes: ["id"],
      });

      if (existingUser) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "User already exists.",
          data: "",
          error: "EMAIL_ALREADY_REGISTERED",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let uploadedImageUrl = null;

      console.log("profilePic: ", profilePic);
      if (profilePic) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(
            profilePic,
            {
              folder: "user_profiles", // Optional Cloudinary folder
              transformation: [{ width: 500, height: 500, crop: "limit" }],
            }
          );

          uploadedImageUrl = uploadedResponse.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR,
            message: "Image upload to Cloudinary failed.",
            error: uploadError.message || "Unknown error",
          });
        }
      }

      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });

      const otpCreated = Math.floor(Date.now() / 1000);

      console.log("uploadedImageUrl: ", uploadedImageUrl);
      profilePic: uploadedImageUrl;
      console.log("profilePic: ", profilePic);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        profilePic,
        otp: otp,
        otpCreatedAt: otpCreated,
      });

      console.log("newUser: ", newUser);

      let otpStore = {};

      otpStore[email] = otp;

      // const html = `<h2>Your OTP is: ${otp}</h2><p>It is valid for 5 minutes.</p>`;

      // await sendEmail(email, "Your OTP for Signup", html);

      return res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Signup successful. Please verify your email using OTP.",
        data: { email },
        error: null,
      });
    } catch (err) {
      return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
        status: HTTP_STATUS_CODES.SERVER_ERROR,
        message: "Server error",
        data: "",
        error: err.message,
      });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const validation = new VALIDATOR(req.body, {
        email: VALIDATION_RULES.USER.EMAIL,
      });

      if (validation.fails()) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "Validation failed.",
          data: "",
          error: validation.errors.all(),
        });
      }

      const user = await User.findOne({
        where: { email },
        isDeleted: false,
        attributes: ["id", "otp", "otpCreatedAt"],
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
          status: HTTP_STATUS_CODES.NOT_FOUND,
          message: "User not found.",
          data: "",
          error: "USER_NOT_FOUND",
        });
      }

      const isValid = verifyOTP(otp, user.otp, user.otpCreatedAt);
      if (!isValid) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "Invalid OTP.",
          data: "",
          error: "INVALID_OTP",
        });
      }

      return res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Email verified successfully!",
        data: "",
        error: null,
      });
    } catch (err) {
      return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
        status: HTTP_STATUS_CODES.SERVER_ERROR,
        message: "Server error",
        data: "",
        error: err.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("req.body: ", req.body);

      const validation = new VALIDATOR(req.body, {
        email: VALIDATION_RULES.USER.EMAIL,
        password: VALIDATION_RULES.USER.PASSWORD,
      });

      if (validation.fails()) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "Validation failed.",
          data: "",
          error: validation.errors.all(),
        });
      }

      const user = await User.findOne({
        where: { email },
        attributes: [
          "id",
          "email",
          "password",
          "accessToken",
          "isLogin",
          "isOnline",
        ],
      });

      if (!user) {
        return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          status: HTTP_STATUS_CODES.UNAUTHORIZED,
          message: "User not found.",
          data: "",
          error: "",
        });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
          status: HTTP_STATUS_CODES.UNAUTHORIZED,
          message: "Invalid credentials.",
          data: "",
          error: "",
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
      });

      user.accessToken = token;
      user.isLogin = true;
      user.isOnline = true;
      await user.save();

      return res.status(HTTP_STATUS_CODES.OK).json({
        status: HTTP_STATUS_CODES.OK,
        message: "Login successful.",
        data: { token, userId: user.id },
        error: "",
      });
    } catch (error) {
      return res.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
        status: HTTP_STATUS_CODES.SERVER_ERROR,
        message: "Server error",
        data: "",
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findOne({
        where: { id: userId, isDeleted: false },
        attributes: ["id", "name", "accessToken"],
      });

      if (!user) {
        return res.json({
          status: HTTP_STATUS_CODES.NOT_FOUND,
          message: "invalidCredentials",
          data: "",
          error: "",
        });
      }
      if (!user.accessToken) {
        return res.json({
          status: HTTP_STATUS_CODES.BAD_REQUEST,
          message: "Already logged out",
          data: "",
          error: "",
        });
      }
      // Set accessToken to NULL (logout)
      await User.update(
        {
          accessToken: null,
          updatedAt: Math.floor(Date.now() / 1000),
          updatedBy: userId,
          isLogin: false,
          isOnlin: false,
        },
        { where: { id: userId, isDeleted: false } }
      );
      return res.json({
        status: HTTP_STATUS_CODES.OK,
        message: "Logout successful.",
        data: "",
        error: "",
      });
    } catch (error) {
      return res.json({
        status: HTTP_STATUS_CODES.SERVER_ERROR,
        message: "serverError",
        data: "",
        error: error.message,
      });
    }
  },
};
