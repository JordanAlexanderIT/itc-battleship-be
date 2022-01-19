function createShips() {
  const ships = [
    {
      size: 1,
      isHorizontal: true,
    },
    {
      size: 2,
      isHorizontal: true,
    },
  ];
  return ships;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function placeShipsRandomly(field) {
  const ships = createShips();

  while (ships.length > 0) {
    const startingPosition = {
      x: getRandomInt(field.length),
      y: getRandomInt(field.length),
    };
    const ship = ships[ships.length - 1];

    const isPlacementLegal = checkPlacementLegality(
      ship,
      startingPosition,
      field
    );
    if (!isPlacementLegal) continue;
    ships.pop();
    placeShip(ship, startingPosition, field);

    // field[0][0] = 1;
  }

  return field;
}
function checkOutOfBounds(ship, startingPosition, fieldSize) {
  if (ship.isHorizontal) {
    if (fieldSize < startingPosition.x + ship.size) return true;
    return false;
  } else {
    if (fieldSize < startingPosition.y + ship.size) return true;
    return false;
  }
}
function checkPlacementLegality(ship, startingPosition, field) {
  const isOutOfBounds = checkOutOfBounds(ship, startingPosition, field.length);
  if (isOutOfBounds) return false;

  for (let i = 0; i < ship.size; i++) {
    let elementInField;
    if (ship.isHorizontal) {
      elementInField = field[startingPosition.x + i][startingPosition.y];
    } else {
      elementInField = field[startingPosition.x][startingPosition.y + i];
    }
    if (elementInField !== 0) return false;
  }
  return true;
}
function placeShip(ship, startingPosition, field) {
  for (let i = 0; i < ship.size; i++) {
    if (ship.isHorizontal)
      field[startingPosition.x + i][startingPosition.y] = 1;
    else field[startingPosition.x][startingPosition.y + i] = 1;
  }
  return true;
}
function tryPlaceShip(ship, startingPosition, field) {
  if (!checkPlacementLegality(ship, startingPosition, field)) return false;

  placeShip(ship, startingPosition, field);
  return true;
}
module.exports = { placeShipsRandomly, tryPlaceShip };
