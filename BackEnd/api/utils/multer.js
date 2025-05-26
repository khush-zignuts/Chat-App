const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for Cloudinary
const upload = multer({ storage });

module.exports = upload;
