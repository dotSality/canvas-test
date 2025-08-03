const CELL_SIZE = 20;

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
  }

  visit() {
    this.visited = true;
    this.color = "orange";
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  show() {
    this.color = "red";
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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
    ctx.fillStyle = cell.color;
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
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
console.log(grid);

const render = () => {
  current.visit();
  const unvisited = current.neighbours.filter((cell) => !cell.visited);
  if (unvisited.length > 0) {
    stack.push(current);
    console.log('1');
    current = unvisited.at(Math.floor(Math.random() * unvisited.length));
    current.show();
  } else if (stack.length > 0) {
    console.log('2');
    current = stack.pop();
    current.show();
  } else {
    console.log('3');
    return
  }
  requestAnimationFrame(() => {
    render();
  })
}

render();
