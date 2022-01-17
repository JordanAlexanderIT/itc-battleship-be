const { createGameSession } = require("../dao/gameSession.js");
const { getUserById } = require("../dao/user.js");
const {
  runGameSessionExpirationTimer,
  waitingForPlayersStateDurationMS,
} = require("../features/gameSession/gameSessionExpiration.js");

async function createGameSessionController(req, res) {
  console.log("created game session");

  const creatorUser = await getUserById(req.body.userId);

  const waitingForPlayerStateExpireDate =
    Date.now() + waitingForPlayersStateDurationMS;

  const gameSession = await createGameSession(
    creatorUser._id,
    creatorUser.displayName,
    waitingForPlayerStateExpireDate
  );
  if (gameSession.error) return res.status(400).json(gameSession.error);

  runGameSessionExpirationTimer(gameSession._id);

  return res
    .status(200)
    .json({ id: gameSession._id, state: gameSession.state });
}

module.exports = {
  createGameSessionController,
};
