const random = (min, max) =>
  Math.trunc((Math.random() * (max - min))) + min;

const isCollided = (hitBox, boundary, direction, velocity) => {
  const collidedBottom = hitBox.y2 >= boundary.y && direction === DIRECTION.Down;
  const collidedTop = hitBox.y1 <= 0 && direction === DIRECTION.Up;
  const collidedLeft = hitBox.x1 <= 0 && direction === DIRECTION.Left;
  const collidedRight = hitBox.x2 >= boundary.x && direction === DIRECTION.Right;

  const deltaUp = collidedTop ? 0 : -velocity;
  const deltaDown = collidedBottom ? 0 : velocity;
  const deltaRight = collidedRight ? 0 : velocity;
  const deltaLeft = collidedLeft ? 0 : -velocity;

  const isHorizontal = direction === DIRECTION.Left || direction === DIRECTION.Right;
  const isVertical = direction === DIRECTION.Up || direction === DIRECTION.Down;

  const deltaX = isHorizontal ? (direction === DIRECTION.Left ? deltaLeft : deltaRight) : 0;
  const deltaY = isVertical ? (direction === DIRECTION.Up ? deltaUp : deltaDown) : 0;

  return { deltaX, deltaY };
};

/**
 *
 * @typedef {{UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3}} Directions
 */
const DIRECTION = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
};

const getHitBox = (x, y, size) => {
  const middle = size / 2;
  const x1 = x - middle;
  const y1 = y - middle;
  const x2 = x + middle;
  const y2 = y + middle;

  return { x1, y1, x2, y2 };
};

class Dot {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class GridCell {
  x1;
  x2;
  y1;
  y2;
  size;

  constructor(x1, y1, x2, y2, size) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.size = size;
  }

  get pivot() {
    return { x: this.size / 2 + this.x1, y: this.size / 2 + this.y1 };
  }

  get position() {
    const { x, y } = this.pivot;
    return { x: Math.floor(x / this.size), y: Math.floor(y / this.size) };
  }
}

class Grid {
  #grid;

  constructor(grid) {
    this.#grid = grid;
  }

  get instance() {
    return this.#grid;
  }

  get size() {
    const x = this.#grid.length;
    const y = this.#grid.at(0).length;
    return { x, y };
  }

  traverse(handler) {
    if (!this.#grid) {
      console.error("Can't traverse over nullish data");
      return;
    }
    this.#grid.flat().forEach(handler);
  }
}

const DEFAULT_GRID_SIZE = 15;
const generateGrid = (width, height, CellInstance = GridCell, size = DEFAULT_GRID_SIZE) => {
  const columns = width / size;
  const rows = height / size;
  const grid = [];
  for (let c = 0 ; c < columns ; c++) {
    const x1 = c * size;
    const x2 = x1 + size;
    const column = [];
    for (let r = 0 ; r < rows ; r++) {
      const y1 = r * size;
      const y2 = y1 + size;
      const cell = new CellInstance(x1, y1, x2, y2, size);
      column.push(cell);
    }
    grid.push(column);
  }

  return new Grid(grid);
};
