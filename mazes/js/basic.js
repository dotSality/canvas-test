const CELL_SIZE = 20;
const WALL_SIZE = 1;

class MazeCell {
  visited;
  color;
  #rawNeighbours = [];
  x;
  y;
  #nearNeighboursMap={ 0: 2, 1: 3, 2:0 ,3 :1 };

  constructor(x, y, ctx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.visited = false;
    this.color = "rgb(102, 179, 229)";
    this.walls = Array.from({ length: 4 }, () => true);
  }

  get neighbours() {
    return this.#rawNeighbours.filter(Boolean);
  }

  fillNeighbours(neighbours) {
    this.#rawNeighbours = neighbours;
  }

  fillBackground() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  init() {
    this.fillBackground();
    this.paintWalls();
  }

  visit() {
    this.visited = true;
    this.color = "orange";
    this.fillBackground();
    this.paintWalls();
  }

  show() {
    this.color = "red";
    this.fillBackground();
    this.paintWalls();
  }

  removeWall(direction) {
    this.walls[direction] = false;
  }

  paintWalls() {
    this.walls.forEach((wall, index) => {
      const neighbour = this.#rawNeighbours[index];
      const hasWall = !neighbour || neighbour.walls[this.#nearNeighboursMap[index]];
      if (!hasWall) return;
      this.ctx.fillStyle = "brown";
      if (index === 0) {
        this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, WALL_SIZE);
      } else if (index === 1) {
        this.ctx.fillRect((this.x + 1) * CELL_SIZE - WALL_SIZE, this.y * CELL_SIZE, WALL_SIZE, CELL_SIZE);
      } else if (index === 2) {
        this.ctx.fillRect(this.x * CELL_SIZE, (this.y + 1) * CELL_SIZE - WALL_SIZE, CELL_SIZE, WALL_SIZE);
      } else if (index === 3) {
        this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, WALL_SIZE, CELL_SIZE);
      }
    });
    this.ctx.fillStyle = this.color;
  }
}


const removeWalls = (a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  if (dy === -1) {
    b.removeWall(2);
    a.removeWall(0);
  } else if (dx === 1) {
    b.removeWall(3);
    a.removeWall(1);
  } else if (dy === 1) {
    b.removeWall(0);
    a.removeWall(2);
  } else if (dx === -1) {
    b.removeWall(1);
    a.removeWall(3);
  }
  a.fillBackground();
  b.fillBackground();
  a.paintWalls();
  b.paintWalls();
}

const canvas = document.getElementById("maze");

const ctx = canvas.getContext("2d");

const width = canvas.width / CELL_SIZE;
const height = canvas.height / CELL_SIZE;

const grid = [];
const stack = [];

for (let row = 0 ; row < width ; row++) {
  for (let col = 0 ; col < height ; col++) {
    const cell = new MazeCell(col, row, ctx);
    cell.init();
    grid.push(cell);
  }
}

for (let row = 0 ; row < height ; row++) {
  for (let col = 0 ; col < width ; col++) {
    const idx = row * height + col;
    const cell = grid[idx];
    cell.fillNeighbours([
        row > 0 ? grid[idx - height] : undefined,
        col < height - 1 ? grid[idx + 1] : undefined,
        row < width - 1 ? grid[idx + height] : undefined,
        col > 0 ? grid[idx - 1] : undefined,
    ]);
  }
}

let current = grid.at(0);
let prev = null;

const render = () => {
  prev = current;
  current.visit();
  const unvisited = current.neighbours.filter((cell) => !cell.visited);
  if (unvisited.length > 0) {
    stack.push(current);
    current = unvisited.at(Math.floor(Math.random() * unvisited.length));
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    return;
  }
  current.show();
  removeWalls(prev, current);
  requestAnimationFrame(() => {
    render();
  });
};

render();
