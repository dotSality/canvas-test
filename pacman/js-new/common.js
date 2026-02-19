const GRID_CELL_SIZE = 20;

const GridLegend = {
    WALL: '#',
    EMPTY: ' ',
}

/**
 * @typedef {{RIGHT: 0, DOWN: 1, LEFT: 2, UP: 3}} Directions
 */
const Direction = {
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3,
};

const random = (min, max) => Math.trunc((Math.random() * (max - min))) + min;
const isNil = (value) => value === null || value === undefined;
const VELOCITY = 0.02 * window.devicePixelRatio;

const getNeighboursCoordinates = (playerX, playerY) => [
    [playerX + 1, playerY],
    [playerX, playerY + 1],
    [playerX - 1, playerY],
    [playerX, playerY - 1],
].filter(([x,y]) => x >= 0 && y >= 0);