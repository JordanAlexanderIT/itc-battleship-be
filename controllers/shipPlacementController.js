const { placeShipsRandomly } = require("../features/shipPlacement.js");

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
};
