const {
  createGameSession,
  joinGameSession,
  updateGameSessionExpirationDate,
} = require("../dao/gameSession.js");
const { getUserById } = require("../dao/user.js");
const {
  runGameSessionExpirationTimer,
  waitingForPlayersStateDurationMS,
  inProgressStateDurationMS,
  refreshGameSessionExpirationTimer,
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
async function joinGameSessionController(req, res) {
  const displayName = req.body.displayName ? req.body.displayName : "Anon";

  const sessionId = req.params.sessionId;
  const joinGameSessionResponse = await joinGameSession(sessionId, displayName);
  if (joinGameSessionResponse.error)
    return res.status(400).json(joinGameSessionResponse.error.message);
  const { gameSession, joiningPlayer } = joinGameSessionResponse;

  const sessionExpireDate = Date.now() + inProgressStateDurationMS;
  await updateGameSessionExpirationDate(sessionId, sessionExpireDate);
  refreshGameSessionExpirationTimer(sessionId);

  const players = gameSession.players.map((player) => player.displayName);
  return res.status(200).json({
    id: gameSession._id,
    playerId: joiningPlayer.id,
    players,
    state: gameSession.state,
  });
}

module.exports = {
  createGameSessionController,
  joinGameSessionController,
};
