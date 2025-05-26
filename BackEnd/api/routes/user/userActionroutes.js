const express = require("express");
const { userActionController } = require("../../controllers/index");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// Send a message
router.get("/getUser", authMiddleware, userActionController.getUser);

router.get("/getLoginUser", authMiddleware, userActionController.getLoginUser);

router.get("/user/:userId", authMiddleware, userActionController.getUserById);

router.put(
  "/user/update/:userId",
  authMiddleware,
  userActionController.updateUserById
);

module.exports = router;
