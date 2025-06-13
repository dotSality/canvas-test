class GameGridCell extends GridCell {
  child;

  constructor(x1, y1, x2, y2, size) {
    super(x1, y1, x2, y2, size);
  }

  fill(child) {
    this.child = child;
    if (!this.child) console.error('No child fo filling has been provided');

    this.child.create();
  }

  empty() {
    if (!this.child) console.error('No child fo filling has been provided');

    this.child.disassemble();
  }
}

const generateGridMap = (grid) => {
  const map = new Map();
  grid.instance.flat().forEach((cell) => {
    map.set(cell.pivot, cell);
  })
  return map;
}

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "blue";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = null;

const { width, height } = ctx.canvas;

const grid = generateGrid(width, height, GameGridCell, 20);

const freeCellsMap = generateGridMap(grid);

const paintCell = (cell) => {
  const {x, y} = cell.pivot;
  cell.fill(new Food(x, y, 2, ctx));
  // const { x, y } = cell.pivot;
  // ctx.fillStyle = "yellow";
  // ctx.strokeStyle = "yellow";
  // ctx.beginPath();
  // ctx.arc(x, y, 1, 0, Math.PI * 2);
  // ctx.stroke();
  // ctx.fill();
};

const destroyCell = (cell) => {
  cell.destroy();
}
grid.traverse(paintCell);

const row = grid.instance.at(0);
let idx = 0;
// setInterval(() => {
//   const cell = row[idx];
//   cell.empty();
//   idx += 1;
// }, 200)
