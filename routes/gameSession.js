const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/checkAuth");
const GameSessionController = require("../controllers/gameSessionController.js");

router.post("/create",authToken, GameSessionController.createGameSessionController);
router.post("/:sessionId/join/", GameSessionController.joinGameSessionController);

module.exports = router;
