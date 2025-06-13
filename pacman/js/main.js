const DEFAULT_GRID_SIZE = 15;

const isOdd = (number) => number % 2 > 0;

const generateGridMap = (grid) => {
  const map = new Map();
  grid.instance.flat().forEach((cell) => {
    map.set(cell.pivot, cell);
  })
  return map;
}

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

grid.instance.forEach((row) => row.forEach(paintCell));
console.log(grid.instance);
