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

module.exports = { createPlayerField };
