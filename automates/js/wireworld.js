(() => {
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
  ctx.canvas.width = 24 * CELL_SIZE;
  ctx.canvas.height = 13 * CELL_SIZE;

  const grid = [];
  const cells = new Set();

  const sizeX = ctx.canvas.width / CELL_SIZE;
  const sizeY = ctx.canvas.height / CELL_SIZE;

  for (let y = 0 ; y < sizeY ; y += 1) {
    grid[y] = [];
    for (let x = 0 ; x < sizeX ; x += 1) {
      grid[y][x] = CellType.EMPTY;
      ctx.fillStyle = CellColor[grid[y][x]];
      ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      cells.add(`${x}${SEPARATOR}${y}`);
    }
  }

  const getNeighbours = (x, y) => {
    return [
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
      [x - 1, y], /* [x, y] */ [x + 1, y],
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
    ].filter(([x, y]) => x >= 0 && y >= 0 && x < sizeX && y < sizeY);
  };

  const isConverted = (neighbours) => {
    if (![1, 2].includes(neighbours.length)) return false;

    return neighbours.every((neighbour) => neighbour === CellType.ELECTRON_HEAD);
  };

  const cellNextGeneration = (grid, x, y) => {
    const cell = grid[x][y];
    switch (cell) {
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

  cells.forEach((cell) => {
    const [sx, sy] = cell.split(SEPARATOR);
    const x = Number(sx);
    const y = Number(sy);
    if ([2, 4, 8, 10].includes(y)) {
      if ([3, 4, 5, 6, 7, 8, 9, 10].includes(x)) {
        ctx.fillStyle = CellColor[CellType.CONDUCTOR];
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else if (x === 17 && [4, 8].includes(y)) {
        ctx.fillStyle = CellColor[CellType.CONDUCTOR];
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    } else if ([3, 9].includes(y)) {
      if ([2, 11, 12, 13, 14, 15, 16].includes(x)) {
        ctx.fillStyle = CellColor[CellType.CONDUCTOR];
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  });

  const simulateNextGeneration = (activeCells) => {

  };
})();
