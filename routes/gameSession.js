const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/checkAuth");
const GameSessionController = require("../controllers/gameSessionController.js");

router.post("/create",authToken, GameSessionController.createGameSessionController);

module.exports = router;
