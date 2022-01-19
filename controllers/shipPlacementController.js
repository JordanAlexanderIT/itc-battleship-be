const { placeShipsRandomly } = require("../features/shipPlacement.js");

async function shipPlacementRandomController(req, res) {
  const userId = req.body.userId;

  function createPlayerField() {
    const field = [];
    const fieldSize = 10;
    for (let i = 0; i < fieldSize; i++) {
      const column = [];
      for (let j = 0; j < fieldSize; j++) {
        column.push(0);
      }
      field.push(column);
    }
    return field;
  }
  const field = createPlayerField();
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
