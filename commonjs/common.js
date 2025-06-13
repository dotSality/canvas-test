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
