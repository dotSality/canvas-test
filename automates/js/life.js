(() => {
  const CELL_SIZE = 2;

  const CellState = {
    ALIVE: 1,
    DEAD: 0,
  };

  const canvas = document.getElementById("automate");
  const ctx = canvas.getContext("2d");

  const size = ctx.canvas.width / CELL_SIZE;

  let cells = new Set();

  const getCoords = (idx, gridSize) => {
    const x = idx % gridSize;
    const y = Math.floor(idx / gridSize);
    return { x, y };
  };

  const drawCell = (x, y, size, state) => {
    ctx.fillStyle = state ? "black" : "white";
    ctx.fillRect(x * size, y * size, size, size);
  };

  const initCells = () => {
    for (let idx = 0 ; idx < size ** 2 ; idx += 1) {
      const state = Math.random() >= 0.5 ? 1 : 0;
      const { x, y } = getCoords(idx, size);
      if (state) {
        cells.add(`${x},${y}`);
      }
      drawCell(x, y, CELL_SIZE, state);
    }
  };

  const getNeighbours = (x, y) => {
    return [
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
      [x - 1, y], /* [x, y] */ [x + 1, y],
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
    ].filter(([x, y]) => x >= 0 && y >= 0 && x < size && y < size);
  };

  const isAlive = (count) => [2, 3].some((n) => n === count);
  const isResurrected = (count) => 3 === count;

  const simulateNextGeneration = (liveCells) => {
    if (liveCells.size === 0) return null;
    const newLiveCells = new Set();
    const potentialCells = new Map();

    for (const cell of liveCells) {
      const [x, y] = cell.split(",");
      const neighbours = getNeighbours(Number(x), Number(y));
      let count = 0;
      for (const [nx, ny] of neighbours) {
        const key = `${nx},${ny}`;
        if (liveCells.has(key)) count += 1;
        else {
          const currentPotentialCellCount = potentialCells.get(key) ?? 0;
          potentialCells.set(key, currentPotentialCellCount + 1);
        }
      }
      if (isAlive(count)) newLiveCells.add(cell);
    }

    for (const [cell, count] of potentialCells.entries()) {
      if (isResurrected(count)) newLiveCells.add(cell);
    }

    return newLiveCells;
  };

  const drawCells = (liveCells) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    for (const cell of liveCells) {
      const [x, y] = cell.split(",");
      drawCell(x, y, CELL_SIZE, CellState.ALIVE);
    }
  };

  const render = () => {
    cells = simulateNextGeneration(cells);
    if (!cells) return false;
    drawCells(cells);
    return true;
  };

  initCells();
  const timer = setInterval(() => {
    const shouldContinue = render();
    if (!shouldContinue) clearInterval(timer);
  }, 50);
})();


