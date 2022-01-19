const {
  createGameSession,
  joinGameSession,
  updateGameSessionExpirationDate,
  getGameSessionById,
} = require("../dao/gameSession.js");
const { getUserById } = require("../dao/user.js");
const {
  runGameSessionExpirationTimer,
  waitingForPlayersStateDurationMS,
  inProgressStateDurationMS,
  refreshGameSessionExpirationTimer,
} = require("../features/gameSession/gameSessionExpiration.js");
const gameSessionStates = require("../features/gameSession/gameSessionStates.js");

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
  const joiningUser = await getUserById(req.body.userId);

  const sessionId = req.params.sessionId;
  const gameSession = await joinGameSession(
    sessionId,
    joiningUser._id,
    joiningUser.displayName
  );
  if (gameSession.error) return res.status(400).json(gameSession.error.message);

  const sessionExpireDate = Date.now() + inProgressStateDurationMS;
  await updateGameSessionExpirationDate(sessionId, sessionExpireDate);
  refreshGameSessionExpirationTimer(sessionId);

  const players = gameSession.players.map((player) => player.displayName);
  return res.status(200).json({
    id: gameSession._id,
    players,
    state: gameSession.state,
  });
}
async function getPlayerGameSessionController(req, res) {
  const sessionId = req.params.sessionId;
  const userId = req.body.userId;

  const gameSession = await getGameSessionById(sessionId);
  if (!gameSession) return res.status(400).json("Invalid session id");
  if (gameSession.error) return res.status(400).json(gameSession.error.message);

  let playerData;
  let playerIndex;
  let otherPlayers = [];
  for (let i = 0; i < gameSession.players.length; i++) {
    const player = gameSession.players[i];
    if (player.id.toString() === userId) {
      playerData = player;
      playerIndex = i;
      otherPlayers = gameSession.players.splice(i, 0);
      break;
    }
  }
  if (!playerData) return res.status(400).json("Invalid player id");

  //ToDo Fully Implement gameSessionStates.inProgress state case
  switch (gameSession.state) {
    case gameSessionStates.waitingForPlayers:
      const players = gameSession.players.map((player) => player.displayName);
      return res.status(200).json({
        players,
        playerIndex,
        state: gameSession.state,
      });
      break;
    case gameSessionStates.inProgress:
      return res.status(200).json({
        state: gameSession.state,
      });
    default:
      return res.status(501).json({
        state: gameSession.state,
      });
      break;
  }
}

module.exports = {
  createGameSessionController,
  joinGameSessionController,
  getPlayerGameSessionController,
};
