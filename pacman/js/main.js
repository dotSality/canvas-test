class GameGridCell extends GridCell {
  child;

  constructor(x1, y1, x2, y2, size) {
    super(x1, y1, x2, y2, size);
  }

  fill(child) {
    this.child = child;
    if (!this.child) console.error("No child fo filling has been provided");

    this.child.create();
  }

  empty(onDispose) {
    if (!this.child) console.error("No child fo filling has been provided");

    this.child?.on('disassembled', () => {
      onDispose?.();
    })
    this.child.disassemble();
  }
}

const PACMAN_GRID_SIZE = 20;
const VELOCITY = 0.5;

const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;

const { width, height } = fieldContext.canvas;

const grid = generateGrid(width, height, GameGridCell, PACMAN_GRID_SIZE);

const paintCell = (cell) => {
  const { x, y } = cell.pivot;
  cell.fill(new Food(x, y, 2, fieldContext));
};

const models = document.getElementById("models");
const modelsContext = models.getContext("2d");

const playerColumnIndex = random(0, grid.size.x);
const playerRowIndex = random(0, grid.size.y);

const cell = grid.instance.at(playerColumnIndex).at(playerRowIndex);

const { x, y } = cell.pivot;

const player = new Player(x, y, PACMAN_GRID_SIZE, 30, modelsContext, random(0, 3), VELOCITY);
player.create();

const enemy = new Enemy(50, 100, PACMAN_GRID_SIZE, modelsContext, random(0, 3), VELOCITY);
enemy.create();

const gui = document.getElementById("gui");
const guiContext = gui.getContext("2d");

const menu = new Gui(guiContext);

const game = new Game();

game.init();
menu.init();

let prevTimestamp = 0;

const render = (timestamp) => {
  const delta = ((timestamp ?? 0) - prevTimestamp) / 1000;
  prevTimestamp = timestamp ?? 0;
  // TODO: fix pause behavior
  if (game.paused) return;
  player.clear();
  enemy.clear();
  const { x, y, direction, hitBox } = player;
  let point;

  if (direction === DIRECTION.Right || direction === DIRECTION.Left) {
    const pointX = direction === DIRECTION.Left ? hitBox.x1 : hitBox.x2;
    point = { pointX, pointY: y };
  } else if (direction === DIRECTION.Up || direction === DIRECTION.Down) {
    const pointY = direction === DIRECTION.Up ? hitBox.y1 : hitBox.y2;
    point = { pointY, pointX: x };
  }
  const { pointX, pointY } = point;

  const column = grid.instance.at(Math.floor(pointX / PACMAN_GRID_SIZE)) ?? grid.instance.at(-1);
  const cell = column.at(Math.floor(pointY / PACMAN_GRID_SIZE));

  if (cell?.child instanceof Food && !cell.child.disassembled) {
    const { hitBox: foodHitBox } = cell.child;
    if ((foodHitBox.x2 >= pointX || foodHitBox.x1 <= pointX) || (foodHitBox.y1 <= pointY || foodHitBox.y2 >= pointY)) {
      cell.empty(() => {
        game.score += 1;
        menu.trigger('printScore', game.score);
      });
    }
  }
  game.render(delta, player, enemy);
  requestAnimationFrame(render);
};

grid.traverse((cell) => {
  if ([player.x].includes(cell.pivot.x) && [player.y].includes(cell.pivot.y)) return;
  paintCell(cell);
});
render();
