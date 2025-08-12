const CELL_SIZE = 20;
const WALL_SIZE = 1;

class MazeCell {
  visited;
  color;
  neighbours;
  x;
  y;

  constructor(x, y, ctx) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.visited = false;
    this.color = "rgb(102, 179, 229)";
    this.neighbours = [];
    this.walls = Array.from({ length: 4 }, () => true);
  }

  init() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    this.paintWalls();
  }

  visit() {
    this.visited = true;
    this.color = "orange";
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    this.paintWalls();
  }

  show() {
    this.color = "red";
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    this.paintWalls();
  }

  paintWalls() {
    this.walls.forEach((hasWall, index) => {
      this.ctx.fillStyle = hasWall ? "brown" : this.color
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

  removeWall(dx, dy) {
    if (dy === -1) {
      this.walls[0] = false;
    } else if (dy === 1) {
      this.walls[2] = false;
    }
    if (dx === 1) {
      this.walls[1] = false;
    } else if (dx === -1) {
      this.walls[3] = false;
    }
    this.paintWalls();
  }
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
    if (col > 0) {
      cell.neighbours.push(grid[idx - 1]);
    }
    if (col < height - 1) {
      cell.neighbours.push(grid[idx + 1]);
    }
    if (row > 0) {
      cell.neighbours.push(grid[idx - height]);
    }
    if (row < width - 1) {
      cell.neighbours.push(grid[idx + height]);
    }
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
  current.removeWall(prev.x - current.x , prev.y - current.y);
  requestAnimationFrame(() => {
    render();
  });
};

render();
