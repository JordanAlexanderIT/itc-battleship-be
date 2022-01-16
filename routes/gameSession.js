const express = require("express");
const router = express.Router();
const GameSessionController = require("../controllers/gameSessionController.js");

router.post("/create", GameSessionController.createGameSessionController);

module.exports = router;
