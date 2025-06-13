function Dot(x, y) {
  this.x = x;
  this.y = y;
}

class AntAutomateGridCell extends GridCell {
  color = "darkgrey";

  constructor(x1, y1, x2, y2, size, color) {
    super(x1, y1, x2, y2, size, color);
  }
}

/**
 *
 * @typedef {{UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3}} Directions
 */

const AntDirections = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

class Ant {
  x;
  y;
  direction;

  /**
   *
   * @param {number} x - abscissa
   * @param {number} y - ordinate
   * @param {Directions} direction - direction for next step
   */
  constructor(x = 0, y = 0, direction = AntDirections.UP) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  rotate(rotation) {
    const newDirection = this.direction + rotation;
    if (newDirection < 0) this.direction = 3;
    else if (newDirection > 3) this.direction = 0;
    else this.direction = newDirection
  }
}

const ANT_SIZE = 4;

const canvas = document.getElementById("automate");
const ctx = canvas.getContext("2d");

const paintCell = (cell) => {
  ctx.fillStyle = cell.color;
  ctx.fillRect(cell.x1, cell.y1, cell.size, cell.size);
  ctx.fillStyle = null;
};

const { width, height } = ctx.canvas;

const antDefaultPosition = new Dot(width / 2, height / 2);

const grid = generateGrid(width, height, AntAutomateGridCell, ANT_SIZE);
const gridSize = grid.size;

const startingColumn = grid.instance.find((row) => row.at(0).x1 === antDefaultPosition.x);

const startingCell = startingColumn.find((cell) => cell.x1 === antDefaultPosition.x && cell.y1 === antDefaultPosition.y);
grid.traverse(paintCell);

const ant = new Ant(startingCell.x, startingCell.y);

let currentColumnIndex = grid.instance.findIndex((col) => col === startingColumn);
let currentRowIndex = startingColumn.findIndex((cell) => cell === startingCell);

const calculateNextIndexes = (x, y, direction) => {
  let nextX, nextY;
  if (direction === AntDirections.UP || direction === AntDirections.DOWN) {
    nextX = x;
    nextY = direction === AntDirections.UP ? y - 1 : y + 1;
  }
  if (direction === AntDirections.LEFT || direction === AntDirections.RIGHT) {
    nextY = y;
    nextX = direction === AntDirections.LEFT ? x - 1 : x + 1;
  }
  return { nextX, nextY };
};

const visitCell = (cell) => {
  const isBlack = cell.color === 'black'
  const rotation = isBlack ? -1 : 1;
  ant.rotate(rotation);
  cell.color = isBlack ? 'white' : 'black';
  paintCell(cell);
}

const turn = () => {
  const currentColumn = grid.instance.at(currentColumnIndex);
  const currentCell = currentColumn.at(currentRowIndex);
  visitCell(currentCell);
  const {nextX, nextY} = calculateNextIndexes(currentColumnIndex, currentRowIndex, ant.direction);
  currentColumnIndex = nextX;
  currentRowIndex = nextY;
}

// for (let i = 0; i < 100000; i++) {
//   setTimeout(turn, i*2);
// }

let currentCell = startingCell;

// let startIndex =



