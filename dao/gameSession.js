const GameSession = require("../schemas/gameSession");
const mongoose = require("mongoose");
const gameSessionStates = require("../features/gameSession/gameSessionStates.js");

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
    return { error };
  }
}
async function getGameSessionById(id) {
  try {
    const gameSession = await GameSession.findOne({ _id: id });
    return gameSession;
  } catch (error) {
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
async function joinGameSession(id, joiningUserId, joiningUserDisplayName) {
  const playersNeededToStartGame = 2;
  if (!mongoose.isValidObjectId(id))
    return { error: new Error("Invalid session id") };

  try {
    const gameSession = await GameSession.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: [{ $size: "$players" }, playersNeededToStartGame] },
      },
      [
        {
          $set: {
            players: {
              $concatArrays: [
                "$players",
                [
                  {
                    id: joiningUserId,
                    displayName: joiningUserDisplayName,
                  },
                ],
              ],
            },
          },
        },
        {
          $set: {
            state: {
              $cond: {
                if: { $eq: [{ $size: "$players" }, playersNeededToStartGame] },
                then: gameSessionStates.shipPlacement,
                else: "$state",
              },
            },
          },
        },
      ],
      { new: true }
    );
    if (!gameSession) return { error: new Error("Invalid session id") };

    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function updatePlayerFieldInGameSession(id, playerId, playerField) {
  const playerObjectId = mongoose.Types.ObjectId(playerId);
  try {
    const gameSession = await GameSession.findOneAndUpdate(
      { _id: id },
      { $set: { "players.$[player].field": playerField } },
      { arrayFilters: [{ "player.id": { $eq: playerObjectId } }], new: true }
    );
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function updateAllPlayerFieldInGameSession(id, playerField) {
  try {
    const gameSession = await GameSession.findOneAndUpdate(
      { _id: id },
      { $set: { "players.$[].field": playerField } },
      { new: true }
    );
    return gameSession;
  } catch (error) {
    console.log(error);
    return { error };
  }
}
async function updateGameSessionExpirationDate(id, expirationDate) {
  try {
    await GameSession.findByIdAndUpdate(id, { expirationDate });
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
  joinGameSession,
  updateGameSessionExpirationDate,
  updatePlayerFieldInGameSession,
  updateAllPlayerFieldInGameSession,
};
