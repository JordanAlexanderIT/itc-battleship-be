const mongoose = require("mongoose");
const gameSessionStates = require("../features/gameSession/gameSessionStates.js");

const gameSessionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creatorUserId: mongoose.Schema.Types.ObjectId,

  state: {
    type: String,
    required: true,
    default: gameSessionStates.waitingForPlayers,
  },
  players: [],
  expirationDate: Date,
});

module.exports = mongoose.model(
  "GameSession",
  gameSessionSchema,
  "gameSessions"
);
