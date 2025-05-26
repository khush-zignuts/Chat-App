const User = require("./User");
const Chat = require("./Chat");
const Message = require("./Message");

// Chat has many Messages
Chat.hasMany(Message, {
  foreignKey: "chatId",
});
Message.belongsTo(Chat, {
  foreignKey: "chatId",
});

User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { foreignKey: "senderId" });

User.hasMany(Message, { foreignKey: "receiverId" });
Message.belongsTo(User, { foreignKey: "receiverId" });

// Chat.sync({ force: true, alter: true });
// Message.sync({ force: true, alter: true });

module.exports = {
  User,
  Chat,
  Message,
};
