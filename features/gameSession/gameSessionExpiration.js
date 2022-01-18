const {
  getGameSessionById,
  deleteGameSessionById,
  getAllGameSessions,
} = require("../../dao/gameSession.js");
const { calculateTimeInMS } = require("./calculateTime.js");

const waitingForPlayersStateDurationMS = calculateTimeInMS(5, 0);
const inProgressStateDurationMS = calculateTimeInMS(30, 0);

const gameSessionIdsToTimers = {};
function setGameSessionExpirationTimeout(sessionId, ms, expirationConditionCB) {
  setTimeout(async () => {
    const gameSession = await getGameSessionById(sessionId);
    if (expirationConditionCB(gameSession)) deleteGameSessionById(sessionId);
  }, ms);
}
async function runGameSessionExpirationTimer(sessionId) {
  const gameSession = await getGameSessionById(sessionId);
  if (!gameSession) return;
  const ms = gameSession.expirationDate - Date.now();
  if (ms <= 0) {
    deleteGameSessionById(sessionId);
    delete gameSessionIdsToTimers[sessionId];
    return;
  }

  const timeoutId = setTimeout(async () => {
    runGameSessionExpirationTimer(sessionId);
  }, ms);
  gameSessionIdsToTimers[sessionId] = timeoutId;
}
async function refreshGameSessionExpirationTimer(sessionId) {
  if (gameSessionIdsToTimers[sessionId]) {
    clearTimeout(gameSessionIdsToTimers[sessionId]);
  }
  runGameSessionExpirationTimer(sessionId);
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
  refreshGameSessionExpirationTimer,
  waitingForPlayersStateDurationMS,
  inProgressStateDurationMS,
};
