const random = (min, max) =>
  Math.trunc((Math.random() * (max - min))) + min;

const isNil = (value) => value === null || value === undefined;

const getNeighboursCoordinates = (playerX, playerY, gridSize) => [
  [playerX + 1, playerY],
  [playerX, playerY + 1],
  [playerX - 1, playerY],
  [playerX, playerY - 1],
].filter(([x, y]) => x >= 0 && y >= 0 && x < gridSize && y < gridSize);

/**
 * @typedef {{Right: 0, Down: 1, Left: 2, Up: 3}} Directions
 */
const DIRECTION = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
};
