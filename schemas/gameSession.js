const mongoose = require("mongoose");

const gameSessionStates = {
  waitingForPlayers: "waiting for players",
  inProgress: "in progress",
};

const gameSessionSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creatorUserId: mongoose.Schema.Types.ObjectId,

  state: {
    type: String,
    required: true,
    default: gameSessionStates.waitingForPlayers,
  },
  players: [],
});

module.exports = mongoose.model(
  "GameSession",
  gameSessionSchema,
  "gameSessions"
);
