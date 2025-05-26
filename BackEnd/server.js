require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").createServer(app);

const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const index = require("./api/routes/index");
// const job = require("./api/utils/cronSchedular");
const { socketSetup } = require("./api/config/socketIo");

// const admin = require("firebase-admin");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "api", "public")));
app.use(bodyParser.json());

// const serviceAccount = require("./api/serviseAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// Routes
app.use("/api", index);

//socketIo
socketSetup(server);

//cron job scheduling:
// job;

//admin bootstrap
// (async () => {
//   try {
//     const result = await adminBootstrap();
//     console.log("adminBootstrap");
//   } catch (err) {
//     console.log(err.message);
//   }
// })();

// Database & Server Initialization
const PORT = process.env.PORT;

server.listen(PORT, async () => {
  // Sync Database and Start Server
  try {
    // await sequelize.sync({ alter: true });
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});
