const PACMAN_GRID_SIZE = 20;
const VELOCITY = 0.12 * window.devicePixelRatio;

const MAP = [
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "F", "F", "F", "F", "F", "F", "F", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "F", "F", "F", "F", "F", "F", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "P", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["F", "F", "F", "F", "F", "F", "W", "W", "W", "W", "W", "W", "F", "F", "F", "F", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "F", "F", "F", "F", "F", "F", "F", "W", "W", "W", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["F", "F", "F", "F", "F", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F", "F"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
  ["W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "F", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]
];

const drawWall = (ctx, coordinates) => {
  ctx.save();
  ctx.fillStyle = "#ffffff60";
  ctx.fillRect(coordinates.x * PACMAN_GRID_SIZE + 1, coordinates.y * PACMAN_GRID_SIZE + 1, PACMAN_GRID_SIZE - 2, PACMAN_GRID_SIZE - 2);
  ctx.restore();
};

const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;

const { width, height } = fieldContext.canvas;

const models = document.getElementById("models");
const modelsContext = models.getContext("2d");

let playerStartCell;
MAP.forEach((column, x) => {
  column.forEach((cell, y) => {
    if (cell === "P") {
      playerStartCell = [x, y];

      return;
    }

    if (cell === "W") {

      drawWall(fieldContext, { x, y });

      return;
    }

    Food.paint({ x, y, size: Food.size, cellSize: PACMAN_GRID_SIZE, ctx: fieldContext });
  });
});

const [playerX, playerY] = playerStartCell;

const startPlayerNeighbours = getNeighboursCoordinates(playerX, playerY, MAP.length)
  .filter(([x, y]) => MAP[x][y] !== "W");

const [directionCellX, directionCellY] = startPlayerNeighbours.at(random(0, startPlayerNeighbours.length));

const initPlayerDirection = directionCellX === playerX
  ? (directionCellY < playerY ? DIRECTION.Up : DIRECTION.Down)
  : (directionCellX > playerX ? DIRECTION.Right : DIRECTION.Left);

const player = new Player(playerX, playerY, PACMAN_GRID_SIZE, 30, modelsContext, initPlayerDirection, VELOCITY, MAP);
player.create();
player.allowedCells = startPlayerNeighbours;

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

player.on('player:eat', () => {
  game.score += 1;
  menu.trigger("menu:score", game.score);
})

const render = (timestamp) => {
  const delta = ((timestamp ?? 0) - prevTimestamp) / 1000;
  prevTimestamp = timestamp ?? 0;

  if (!game.paused) {
    player.clear();
    enemy.clear();
  }

  game.render(delta, player, enemy);
  requestAnimationFrame(render);
};

render();
