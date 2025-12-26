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

    this.child?.on("disassembled", () => {
      onDispose?.();
    });
    this.child.disassemble();
  }
}

class Wall {
  x;
  y;
  size;
  ctx;

  constructor(x,y, size, ctx) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
  }

  create() {
    console.warn('Wall.create is not implemented');
  }
}

const PACMAN_GRID_SIZE = 20;
const VELOCITY = 0.5 * window.devicePixelRatio;

const WALLS_TEMPLATE = [
  [[0, 0], [4, 8]],
  [[6, 0], [11, 3]],
  [[13, 0], [15, 8]],
  [[17, 0], [23, 2]],
  [[25, 0], [29, 13]],
  [[6, 5], [11, 13]],
  [[17, 4], [23, 13]],
  [[0, 10], [4, 18]],
  [[6, 15], [11, 25]],
  [[13, 10], [15, 25]],
  [[17, 15], [23, 25]],
  [[25, 15], [29, 25]],
  [[0, 20], [4, 29]],
  [[6, 27], [15, 29]],
  [[17, 27], [29, 29]],
];

const isWall = (x,y) => {
  const block = WALLS_TEMPLATE.find(([p1, p2]) => {
    const [x1, y1] = p1, [x2, y2] = p2;
    const isWalledX = x >= x1 && x <= x2;
    const isWalledY = y >= y1 && y <= y2;
    return isWalledX && isWalledY;
  });

  return Boolean(block);
}

const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;

const { width, height } = fieldContext.canvas;
const grid = generateGrid(width, height, GameGridCell, PACMAN_GRID_SIZE);

const models = document.getElementById("models");
const modelsContext = models.getContext("2d");

let playerStartCell;
grid.traverse((cell) => {
  if (cell === playerStartCell) {
    return;
  }

  const { x, y } = cell.position;
  if (isWall(x, y)) {

    cell.fill(new Wall(x,y));

    return;
  }

  if (Math.random() > 0.95 && !playerStartCell) {
    playerStartCell = cell;
  } else {
    const { x: pivotX, y: pivotY } = cell.pivot;

    cell.fill(new Food(pivotX, pivotY, 2, fieldContext));
  }
});

const drawWalls = () => {
  fieldContext.save();
  fieldContext.strokeStyle = "white";
  fieldContext.strokeWidth = 2;
  WALLS_TEMPLATE.forEach(([p1, p2]) => {
    const [x1, y1] = p1, [x2, y2] = p2;
    const px1 = x1 * PACMAN_GRID_SIZE + 2;
    const px2 = (x2 + 1) * PACMAN_GRID_SIZE - 2;
    const py1 = y1 * PACMAN_GRID_SIZE + 2;
    const py2 = (y2 + 1) * PACMAN_GRID_SIZE - 2;
    fieldContext.beginPath();
    fieldContext.roundRect(px1, py1, px2 - px1, py2 - py1, 5);
    fieldContext.stroke();
  });
  fieldContext.restore();
}
drawWalls();

const { x, y } = playerStartCell.pivot;

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

menu.on("start", () => {
  game.paused = false;
});

let prevTimestamp = 0;
// TODO: consider using devicePixelRatio for canvas sizes | moving | etc.
const render = (timestamp) => {
  const delta = ((timestamp ?? 0) - prevTimestamp) / 1000;
  prevTimestamp = timestamp ?? 0;

  if (!game.paused) {
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
          menu.trigger("printScore", game.score);
        });
      }
    } else if (cell?.child instanceof Wall) {

      const delta = 3;

      const {x1, x2, y1, y2} = cell

      if (direction === DIRECTION.Left) {
        player.movingBlocked = hitBox.x1 <= x2 + delta;
      } else if (direction === DIRECTION.Right) {
        player.movingBlocked = hitBox.x2 >= x1 - delta;
      } else if (direction === DIRECTION.Up) {
        player.movingBlocked = hitBox.y1 <= y2 + delta;
      } else if (direction === DIRECTION.Down) {
        player.movingBlocked = hitBox.y2 >= y1 - delta;
      }
    }
  }

  game.render(delta, player, enemy);
  requestAnimationFrame(render);
};

render();
