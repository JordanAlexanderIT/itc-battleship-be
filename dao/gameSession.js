const GameSession = require("../schemas/gameSession");
const mongoose = require("mongoose");

async function createGameSession(
  creatorUserId,
  creatorDisplayName,
  expirationDate
) {
  try {
    const gameSessionData = {
      _id: new mongoose.Types.ObjectId(),
      creatorUserId: creatorUserId,
      players: [{ id: creatorUserId, displayName: creatorDisplayName }],
      expirationDate,
    };

    const gameSession = await GameSession.create(gameSessionData);
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function getGameSessionById(id) {
  try {
    const gameSession = await GameSession.findOne({ _id: id });
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function getAllGameSessions() {
  try {
    const gameSession = await GameSession.find();
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function deleteGameSessionById(id) {
  try {
    await GameSession.deleteOne({ _id: id });
  } catch (error) {
    console.log(error);
    return { error };
  }
}
module.exports = {
  createGameSession,
  getGameSessionById,
  getAllGameSessions,
  deleteGameSessionById,
};
