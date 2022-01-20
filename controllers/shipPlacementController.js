const {
  getGameSessionById,
  updatePlayerFieldInGameSession,
} = require("../dao/gameSession.js");
const gameSessionStates = require("../features/gameSession/gameSessionStates.js");
const {
  placeShipsRandomly,
  tryPlaceShip,
} = require("../features/shipPlacement.js");

async function shipPlacementController(req, res) {
  const userId = req.body.userId;
  const sessionId = req.params.sessionId;

  const { size, isHorizontal, startPosition } = req.body;
  const gameSession = await getGameSessionById(sessionId);
  if (!gameSession) return res.status(400).json("Could not find game session");
  if (gameSession.state !== gameSessionStates.shipPlacement)
    return res
      .status(400)
      .json(
        `Can only place ships in ${gameSessionStates.shipPlacement}. current state is ${gameSession.state}`
      );

  const player = gameSession.players.find(
    (player) => player.id.toString() === userId
  );

  const shipToPlace = { size, isHorizontal };
  const placeShipResponse = tryPlaceShip(
    shipToPlace,
    startPosition,
    player.field
  );
  if (!placeShipResponse.success)
    return res.status(400).json(placeShipResponse.message);

  const updatePlayerFieldResponse = await updatePlayerFieldInGameSession(
    sessionId,
    userId,
    player.field
  );
  if (updatePlayerFieldResponse.error)
    if (!placeShipResponse) return res.status(400).json("Could not place ship");

  return res.status(200).json(player.field);
}
async function shipPlacementRandomController(req, res) {
  const userId = req.body.userId;

  placeShipsRandomly(field);

  return res
    .status(200)
    .json(
      "To be implemented. Will return the player field with ships randomly placed"
    );
}

module.exports = {
  shipPlacementRandomController,
  shipPlacementController,
};
