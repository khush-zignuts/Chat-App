const express = require("express");
const router = express.Router();
const authRoute = require("./auth/authRoute");
const messageRoutes = require("./message/messageRoutes");
const searchUsersRoute = require("./search/searchUsersRoute");
const userActionroutes = require("./user/userActionroutes");
const chatRoutes = require("./chat/chatroutes");

router.use("/user", authRoute);

router.use("/chat", chatRoutes);

router.use("/message", messageRoutes);

//user authentication
// router.use("/search", searchUsersRoute);

router.use("/action", userActionroutes);

module.exports = router;
