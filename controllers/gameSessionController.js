const { createGameSession } = require("../dao/gameSession.js");
const { getUserById } = require("../dao/user.js");

async function createGameSessionController(req, res) {
  console.log("created game session");

  const creatorUser = await getUserById(req.body.userId);

  const gameSession = await createGameSession(
    creatorUser._id,
    creatorUser.displayName
  );
  if (gameSession.error) return res.status(400).json(gameSession.error);
  return res
    .status(200)
    .json({ id: gameSession._id, state: gameSession.state });
}

module.exports = {
  createGameSessionController,
};
