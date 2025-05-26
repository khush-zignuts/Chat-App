const socketIo = require("socket.io");

let io;
let users = {};
const socketSetup = (server) => {
  // Initialize socket.io with the server
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Set up the connection event
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // registration
    socket.on("register", (user) => {
      console.log(`${user.name} has connected with socket ID ${socket.id}`);

      const userId = user.id;

      // Store the mapping: userName -> socket.id
      users[userId] = socket.id;

      // Send confirmation back to the frontend
      socket.emit("registered", {
        message: `${user.name} has connected with socket ID ${socket.id}`,
      });
      // Here you can store user data in a more persistent storage if needed
    });

    // Handle incoming message event
    socket.on("sendMessage", (data) => {
      const { chatId, senderId, receiverId, message } = data;
      console.log("data: ", data);

      const messagePayload = {
        chatId,
        senderId,
        receiverId,
        message,
        // timestamp: new Date().toISOString(),
      };

      // users[receiverId] = socket.id;
      // Emit the message to the specific receiver
      // if (users[receiverId]) {
      //   io.to(users[receiverId]).emit("message", {
      //     chatId: chatId,
      //     sender: senderId,
      //     receiverId: receiverId,
      //     message: message,
      //   });
      // }

      if (users[receiverId]) {
        io.to(users[receiverId]).emit("message", messagePayload);
      }

      if (users[senderId]) {
        io.to(users[senderId]).emit("message", messagePayload);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Clean up user from user list on disconnect
      // for (const userId in users) {
      //   if (users[userId] === socket.id) {
      //     delete users[userId];
      //     break;
      //   }
      // }
    });
  });
};

module.exports = { socketSetup };
