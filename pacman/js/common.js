const random = (min, max) =>
  Math.trunc((Math.random() * (max - min))) + min;

const getNeighboursCoordinates = (playerX, playerY) => [
  [playerX, playerY - 1],
  [playerX, playerY + 1],
  [playerX - 1, playerY],
  [playerX + 1, playerY]
];

/**
 * @typedef {{Up: 0, Right: 1, Down: 2, Left: 3}} Directions
 */
const DIRECTION = {
  Right: 0,
  Down: 1,
  Left: 2,
  Up: 3,
};

class GridCell {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
}

class GameGridCell extends GridCell {
  child;

  constructor(x, y, size) {
    super(x, y, size);
  }

  fill(child) {
    this.child = child;
    if (!this.child) console.error("No child fo filling has been provided");
    else this.child.create();
  }

  empty(onDispose) {
    if (!this.child) console.error("No child fo filling has been provided");

    this.child?.on("disassembled", () => {
      onDispose?.();
    });
    this.child.disassemble();
  }
}

class Wall {
  x;
  y;
  size;
  ctx;

  constructor(x, y, size, ctx) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
  }

  create() {
    console.warn("Wall.create is not implemented");
  }
}
