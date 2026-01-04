const PACMAN_GRID_SIZE = 20;
const VELOCITY = 0.5;

const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;

const { width, height } = fieldContext.canvas;

const grid = Array.from({ length: height / PACMAN_GRID_SIZE }, (_, row) => {
  return Array.from({ length: width / PACMAN_GRID_SIZE }, (_, column) => {
    return new GameGridCell(column, row, PACMAN_GRID_SIZE);
  });
});

const models = document.getElementById("models");
const modelsContext = models.getContext("2d");

const freeCells = [];

grid.flat().forEach((cell) => {
  const { x, y } = cell;
  if (!Walls.isWalled(x, y)) {
    freeCells.push(cell);
  }
});

const playerStartCell = freeCells.at(random(0, freeCells.length));

freeCells.forEach((cell) => {
  if (cell === playerStartCell) {
    return;
  }

  const { x, y } = cell;

  cell.fill(new Food(x, y, 2, PACMAN_GRID_SIZE, fieldContext));
});

Walls.drawWalls(fieldContext, PACMAN_GRID_SIZE);

const { x: playerX, y: playerY } = playerStartCell;

const neighboursCoordinates = [[playerX, playerY - 1], [playerX, playerY + 1], [playerX - 1, playerY], [playerX + 1, playerY]];

const neighbours = grid.flat().filter((cell) => {
  return cell.child && neighboursCoordinates.some((neighbour) => {
    const [x, y] = neighbour;
    return x === cell.x && y === cell.y;
  });
});

const directionCell = neighbours.at(random(0, neighbours.length));

const initPlayerDirection = directionCell.x === playerX
  ? (directionCell.y > playerY ? DIRECTION.Up : DIRECTION.Down)
  : (directionCell.x > playerX ? DIRECTION.Right : DIRECTION.Left);

const player = new Player(playerX, playerY, PACMAN_GRID_SIZE, 30, modelsContext, initPlayerDirection, VELOCITY);
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
  player.initControls();
});

let prevTimestamp = 0;
// TODO: consider using devicePixelRatio for canvas sizes | moving | etc.
const render = (timestamp) => {
  const delta = ((timestamp ?? 0) - prevTimestamp) / 1000;
  prevTimestamp = timestamp ?? 0;

  if (!game.paused) {
    player.clear();
    enemy.clear();
    const { x, y, direction } = player;

    // const column = grid.at(Math.floor(pointX / PACMAN_GRID_SIZE)) ?? grid.instance.at(-1);
    // const cell = column.at(Math.floor(pointY / PACMAN_GRID_SIZE));

    // if (cell?.child instanceof Food && !cell.child.disassembled) {
    // if ((foodHitBox.x2 >= pointX || foodHitBox.x1 <= pointX) || (foodHitBox.y1 <= pointY || foodHitBox.y2 >= pointY)) {
    //   cell.empty(() => {
    //     game.score += 1;
    //     menu.trigger("printScore", game.score);
    //   });
    // }
    // }
    // const { x: posX, y: posY } = cell.position;

    // if (Walls.isWalled(posX, posY)) {
    //   const { x: pivotX, y: pivotY } = cell.pivot;
    //   const delta = 2;

    // if (direction === DIRECTION.Left) {
    //   player.movingBlocked = hitBox.x1 <= pivotX + delta;
    // } else if (direction === DIRECTION.Right) {
    //   player.movingBlocked = hitBox.x2 >= pivotX - delta;
    // } else if (direction === DIRECTION.Up) {
    //   player.movingBlocked = hitBox.y1 <= pivotY + delta;
    // } else if (direction === DIRECTION.Down) {
    //   player.movingBlocked = hitBox.y2 >= pivotY - delta;
    // }
    // }
  }

  game.render(delta, player, enemy);
  requestAnimationFrame(render);
};

render();
