const CellType = {
  EMPTY: 0,
  ELECTRON_HEAD: 1,
  ELECTRON_TAIL: 2,
  CONDUCTOR: 3,
};

const CellColor = {
  [CellType.EMPTY]: "black",
  [CellType.ELECTRON_HEAD]: "blue",
  [CellType.ELECTRON_TAIL]: "red",
  [CellType.CONDUCTOR]: "yellow",
};

const SEPARATOR = ",";
const CELL_SIZE = 30;

const canvas = document.getElementById("automate");
const ctx = canvas.getContext("2d");

// TODO: LOGIC GATES
// ctx.canvas.width = 24 * CELL_SIZE;
// ctx.canvas.height = 13 * CELL_SIZE;

ctx.canvas.width = 14 * CELL_SIZE;
ctx.canvas.height = 13 * CELL_SIZE;

const sizeX = ctx.canvas.width / CELL_SIZE;
const sizeY = ctx.canvas.height / CELL_SIZE;
const parseCell = (cell) => cell.split(",").map((n) => parseInt(n));

// TODO: LOGIC GATES
// cells.forEach((cell) => {
//   const [sx, sy] = cell.split(SEPARATOR);
//   const x = Number(sx);
//   const y = Number(sy);
//   if ([2, 4, 8, 10].includes(y)) {
//     if ([3, 4, 5, 6, 7, 8, 9, 10].includes(x)) {
//       ctx.fillStyle = CellColor[CellType.CONDUCTOR];
//       ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
//     } else if (x === 17 && [4, 8].includes(y)) {
//       ctx.fillStyle = CellColor[CellType.CONDUCTOR];
//       ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
//     }
//   } else if ([3, 9].includes(y)) {
//     if ([2, 11, 12, 13, 14, 15, 16].includes(x)) {
//       ctx.fillStyle = CellColor[CellType.CONDUCTOR];
//       ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
//     }
//   }
// });

let usableCells = new Map();
["0,3", "1,3", "2,3", "3,3", "4,3", "5,3", "6,3", "8,3", "9,3", "10,3", "11,3", "12,3", "13,3", "0,9", "1,9", "2,9",
  "3,9", "4,9", "5,9", "7,9", "8,9", "9,9", "10,9", "11,9", "12,9", "13,9", "6,2", "7,2", "6,4", "7,4", "6,8", "7,8", "6,10", "7,10"]
  .forEach((coords) => {
    usableCells.set(coords, CellType.CONDUCTOR);
  });

const isConverted = (neighbours) => {
  let count = 0;

  for (const neighbour of neighbours) {
    if (count > 2) break;
    if (!neighbour) continue;
    const type = usableCells.get(neighbour);
    count += type === CellType.ELECTRON_HEAD ? 1 : 0;
  }

  return count === 1 || count === 2;
};

const getNeighbours = (x, y) => {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y], /* [x, y] */ [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ]
    .reduce((acc, coords) => {
      const [x, y] = coords;
      const type = usableCells.get(`${x},${y}`);
      if (type !== undefined) {
        acc.push(coords.join(","));
      }
      return acc;
    }, []);
};

const cellNextGeneration = (coords, type) => {
  const [x, y] = parseCell(coords);
  switch (type) {
    case CellType.EMPTY:
      return CellType.EMPTY;
    case CellType.ELECTRON_HEAD:
      return CellType.ELECTRON_TAIL;
    case CellType.ELECTRON_TAIL:
      return CellType.CONDUCTOR;
    case CellType.CONDUCTOR:
      const neighbours = getNeighbours(x, y);
      return isConverted(neighbours) ? CellType.ELECTRON_HEAD : CellType.CONDUCTOR;
  }
};

const init = () => {
  ["0,3", "0,9"].forEach((coords) => {
    usableCells.set(coords, CellType.ELECTRON_HEAD);
  });
};

const isFinished = (cells) => {
  const nonConductors = [...cells.values()].filter((type) => type !== CellType.CONDUCTOR);
  return nonConductors.length === 0;
};

/**
 * @param {Map<String, Number>} cells
 */
const renderCells = (cells) => {
  cells.entries().forEach(([coords, type]) => {
    const [x, y] = parseCell(coords);
    ctx.fillStyle = CellColor[type];
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
};

/**
 * @param {Map<String, Number>} activeCells
 * @returns {Map<String, Number>}
 */
const simulateNextGeneration = (activeCells) => {
  const newCells = new Map();
  activeCells.entries().forEach(([coords, oldType]) => {
    const newType = cellNextGeneration(coords, oldType);
    newCells.set(coords, newType);
  });
  return newCells;
};

const render = () => {
  if (isFinished(usableCells)) {
    init();
  } else {
    usableCells = simulateNextGeneration(usableCells) ?? usableCells;
  }
  renderCells(usableCells);
};

let intervalId = null;

const start = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  renderCells(usableCells);
  intervalId = setInterval(() => {
    render();
  }, 500);
};

const stop = () => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  clearInterval(intervalId);
  intervalId = null;
};

export default { start, stop };
