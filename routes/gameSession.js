const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/checkAuth");
const GameSessionController = require("../controllers/gameSessionController.js");

router.post(
  "/create",
  authToken,
  GameSessionController.createGameSessionController
);
router.post(
  "/:sessionId/join/",
  authToken,
  GameSessionController.joinGameSessionController
);
router.post(
  "/:sessionId/",
  authToken,
  GameSessionController.getPlayerGameSessionController
);

module.exports = router;
