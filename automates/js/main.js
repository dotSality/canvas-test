function Dot(x, y) {
  this.x = x;
  this.y = y;
}

const paintCell = (cell) => {
  ctx.fillStyle = cell.color;
  ctx.fillRect(cell.x1, cell.y1, cell.size, cell.size);
  ctx.fillStyle = null;
};

const invertIndex = (value, limit) => {
  if (value >= limit) {
    return value - limit;
  } else if (value < 0) {
    return limit + value;
  }
  return value;
};

const calculateNextIndexes = (x, y, size, direction) => {
  let nextX, nextY;
  if (direction === AntDirections.UP || direction === AntDirections.DOWN) {
    nextX = x;
    nextY = invertIndex(direction === AntDirections.UP ? y - 1 : y + 1, size);
  }
  if (direction === AntDirections.LEFT || direction === AntDirections.RIGHT) {
    nextY = y;
    nextX = invertIndex(direction === AntDirections.LEFT ? x - 1 : x + 1, size);
  }
  return { nextX, nextY };
};

class AntAutomateGridCell extends GridCell {
  color = "darkgrey";

  constructor(x1, y1, x2, y2, size, color) {
    super(x1, y1, x2, y2, size, color);
  }
}

const ANT_SIZE = 4;

const canvas = document.getElementById("automate");
const ctx = canvas.getContext("2d");
const { width, height } = ctx.canvas;

const grid = generateGrid(
    width,
    height,
    AntAutomateGridCell,
    ANT_SIZE
);

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
  column;
  row;

  /**
   *
   * @param {number} x - abscissa
   * @param {number} y - ordinate
   * @param {number} column - ordinate
   * @param {number} row - ordinate
   * @param {Directions} direction - direction for next step
   */
  constructor(
      x = 0,
      y = 0,
      column = 0,
      row = 0,
      direction = AntDirections.UP
  ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.column = column;
    this.row = row;
  }

  rotate(rotation) {
    const newDirection = this.direction + rotation;
    if (newDirection < 0) this.direction = 3;
    else if (newDirection > 3) this.direction = 0;
    else this.direction = newDirection
  }

  visit (cell) {
    const isBlack = cell.color === 'black'
    const rotation = isBlack ? -1 : 1;
    this.rotate(rotation);
    cell.color = isBlack ? 'white' : 'black';
    paintCell(cell);
  }

  turn(grid, size) {
    const currentColumn = grid.at(this.column);
    const currentCell = currentColumn.at(this.row);
    this.visit(currentCell);
    const {nextX, nextY} = calculateNextIndexes(this.column, this.row, size, ant.direction);
    this.column = nextX;
    this.row = nextY;
  }
}

const antDefaultPosition = new Dot(width / 2, height / 2);

const startingColumn = grid.instance.find((row) => row.at(0).x1 === antDefaultPosition.x);

const startingCell = startingColumn.find((cell) => cell.x1 === antDefaultPosition.x && cell.y1 === antDefaultPosition.y);
grid.traverse(paintCell);

const currentColumnIndex = grid.instance.findIndex((col) => col === startingColumn);
const currentRowIndex = startingColumn.findIndex((cell) => cell === startingCell);

const ant = new Ant(startingCell.x, startingCell.y, currentColumnIndex, currentRowIndex);

setInterval(() => ant.turn(grid.instance, grid.size.x), 1);



