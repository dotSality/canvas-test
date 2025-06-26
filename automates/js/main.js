// antRender();

const CELL_SIZE = 2;

const CellState = {
  ALIVE: 1,
  DEAD: 0,
}

const canvas = document.getElementById('automate');
const ctx = canvas.getContext('2d');

const cellsCount = ctx.canvas.width / CELL_SIZE;

const cells = new Uint8Array(cellsCount);

const checkCell = (cell) => {

}

lifeRender();
