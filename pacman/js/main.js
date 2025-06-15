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

const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;

const { width, height } = fieldContext.canvas;

const grid = generateGrid(width, height, GameGridCell, 20);

const paintCell = (cell) => {
  const {x, y} = cell.pivot;
  cell.fill(new Food(x, y, 2, fieldContext));
};

// grid.traverse(paintCell);

// let col = 0;
// let r = 0;
// setInterval(() => {
//   if (r >= grid.size.y)  {
//     col += 1;
//     r = 0;
//   }
//   const row = grid.instance.at(col);
//   const cell = row[r];
//   cell.empty();
//   r += 1;
// }, 50)

const models = document.getElementById("models");
const modelsContext = models.getContext("2d");

const playerColumnIndex = random(0, grid.size.x);
const playerRowIndex = random(0, grid.size.y);

const cell = grid.instance.at(playerColumnIndex).at(playerRowIndex);

const { x, y } =  cell.pivot;

const player = new Player(x, y, 10, 30, modelsContext);
cell.fill(player);



const render = () => {
  player.render();
  requestAnimationFrame(render);
}


grid.traverse((cell) => {
  if ([player.x].includes(cell.pivot.x) && [player.y].includes(cell.pivot.y)) return;
  paintCell(cell);
});
render();
// let percentage = 0;
// let percentageDelta = 1;
// setInterval(() => {
//   if (percentage > 10 || percentage < 0) percentageDelta *= -1;
//
//   percentage += percentageDelta;
// }, 100)