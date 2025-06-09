const DEFAULT_GRID_SIZE = 15;

const isOdd = (number) => number % 2 > 0;

class GridCell {
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
}

const generateGridMap = (grid) => {
  const map = new Map();
  grid.flat().forEach((cell) => {
    map.set(cell.pivot, cell);
  })
  return map;
}

const generateGrid = (width, height, size = DEFAULT_GRID_SIZE) => {
  const columns = width / size;
  const rows = height / size;
  const grid = [];
  for (let c = 0 ; c < columns ; c++) {
    const x1 = c * size;
    const x2 = x1 + size;
    const row = [];
    for (let r = 0 ; r < rows ; r++) {
      const y1 = r * size;
      const y2 = r + size;
      const cell = new GridCell(x1, y1, x2, y2, size);
      row.push(cell);
    }
    grid.push(row);
  }

  return grid;
};

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const { width, height } = ctx.canvas;

const grid = generateGrid(width, height);

const freeCellsMap = generateGridMap(grid);

const paintCell = (cell) => {
  const { x, y } = cell.pivot;
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();
};

grid.forEach((row) => row.forEach(paintCell));
