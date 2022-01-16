const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 8000;
app.listen(PORT, "127.0.0.1");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DB = process.env.DB_CONNECTION;

const userRoutes = require("./routes/user");
const gameSessionRoutes = require("./routes/gameSession.js");

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/game-session", gameSessionRoutes);
