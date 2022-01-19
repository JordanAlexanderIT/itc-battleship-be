const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/checkAuth");
const GameSessionController = require("../controllers/gameSessionController.js");

const shipPlacementRoutes = require("./shipPlacement.js");

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

router.use("/:sessionId/ship-placement", shipPlacementRoutes);

module.exports = router;
