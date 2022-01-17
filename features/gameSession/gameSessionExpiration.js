const {
  getGameSessionById,
  deleteGameSessionById,
  getAllGameSessions,
} = require("../../dao/gameSession.js");
const { calculateTimeInMS } = require("./calculateTime.js");

const waitingForPlayersStateDurationMS = calculateTimeInMS(0, 10);

function setGameSessionExpirationTimeout(sessionId, ms, expirationConditionCB) {
  setTimeout(async () => {
    const gameSession = await getGameSessionById(sessionId);
    if (expirationConditionCB(gameSession)) deleteGameSessionById(sessionId);
  }, ms);
}
async function runGameSessionExpirationTimer(sessionId) {
  const gameSession = await getGameSessionById(sessionId);
  const ms = gameSession.expirationDate - Date.now();
  if (ms <= 0) {
    deleteGameSessionById(sessionId);
    return;
  }

  setTimeout(async () => {
    runGameSessionExpirationTimer(sessionId);
  }, ms);
}
async function runAllGameSessionsExpirationTimer() {
  const gameSessions = await getAllGameSessions();
  for (const gameSession of gameSessions) {
    runGameSessionExpirationTimer(gameSession._id);
  }
}
runAllGameSessionsExpirationTimer();

module.exports = {
  setGameSessionExpirationTimeout,
  runGameSessionExpirationTimer,
  waitingForPlayersStateDurationMS,
};
