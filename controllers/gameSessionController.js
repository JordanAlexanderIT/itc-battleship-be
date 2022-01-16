const { createGameSession } = require("../dao/gameSession.js");

async function createGameSessionController(req, res) {
  console.log("created game session");
  const gameSession = await createGameSession("34574574", "or");
  if (gameSession.error) return res.status(400).json(gameSession.error);

  return res
    .status(200)
    .json({ id: gameSession._id, state: gameSession.state });
}

module.exports = {
  createGameSessionController,
};
