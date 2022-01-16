const GameSession = require("../schemas/gameSession");
const mongoose = require("mongoose");

async function createGameSession(creatorUserId, creatorDisplayName) {
  try {
    const gameSessionData = {
      _id: new mongoose.Types.ObjectId(),
      creatorUserId: creatorUserId,
      players: [{ id: creatorUserId, displayName: creatorDisplayName }],
    };

    const gameSession = await GameSession.create(gameSessionData);
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}

module.exports = {
  createGameSession,
};
