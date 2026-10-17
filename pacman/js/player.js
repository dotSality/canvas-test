const ROTATIONS = {
  ArrowRight: DIRECTION.Right,
  ArrowDown: DIRECTION.Down,
  ArrowLeft: DIRECTION.Left,
  ArrowUp: DIRECTION.Up,
};

const isHorizontal = (direction) => [DIRECTION.Left, DIRECTION.Right].includes(direction);
const isVertical = (direction) => [DIRECTION.Up, DIRECTION.Down].includes(direction);
const isDirectionNegative = (direction) => [DIRECTION.Up, DIRECTION.Left].includes(direction);
const getDirectionSign = (direction) => isDirectionNegative(direction) ? -1 : 1;

class Player extends EventEmitter {
  tileX;
  tileY;
  r;
  alive;
  ctx;
  direction;
  directionBuffer;
  progress;

  velocity;

  opening;
  #openingDelta = 1;

  constructor(tileX, tileY, size, opening, ctx, direction = DIRECTION.Up, velocity = 1, map) {
    super();

    console.log(tileX, tileY);

    this.tileX = tileX;
    this.tileY = tileY;
    this.r = size / 2;
    this.ctx = ctx;
    this.opening = opening;
    this.alive = true;
    this.direction = direction;
    this.velocity = velocity;
    this.progress = 0;

    this.map = map;
  }

  paint(opening) {

    const deltaX = isHorizontal(this.direction) ? this.progress * this.directionSign : 0;
    const deltaY = isVertical(this.direction) ? this.progress * this.directionSign : 0;

    const centerX = (deltaX + 0.5 + this.tileX) * PACMAN_GRID_SIZE;
    const centerY = (deltaY + 0.5 + this.tileY) * PACMAN_GRID_SIZE;

    const rotationAngle = (this.direction * Math.PI * 2) / 4;
    this.ctx.save();

    const angle = Math.PI * (opening / 100);
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.arc(
      centerX,
      centerY,
      this.r,
      angle + rotationAngle,
      2 * Math.PI - angle + rotationAngle,
    );
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  get directionSign() {
    return getDirectionSign(this.direction);
  }

  create() {
    this.paint(this.opening);
  }

  animate() {
    if (this.opening <= 0 || this.opening >= 30) {
      this.#openingDelta *= -1;
    }
    this.opening += this.#openingDelta;

    this.paint(this.opening);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  disassemble() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  checkRotationTile(x, y) {
    const nextDirectionSign = getDirectionSign(this.directionBuffer);
    const rotatedX = isHorizontal(this.directionBuffer) ? x + 1 * nextDirectionSign : x;
    const rotatedY = isHorizontal(this.directionBuffer) ? y : y + 1 * nextDirectionSign;

    return (this.map[rotatedX][rotatedY] ?? "W") !== "W";
  }

  checkIsTileAllowed(x, y) {
    const isNegative = x <= 0 || y <= 0; // blocks first cell to switch on
    const isExceeded = x >= this.map.length - 1 || y >= this.map.length - 1; // blocks last cell to switch on
    return !(isNegative || isExceeded);
  }

  move() {
    const nextProgress = Math.min(this.progress + this.velocity * 0.1);

    if (nextProgress < 1) {
      this.progress = nextProgress;

      return;
    }

    const nextX = isHorizontal(this.direction) ? this.tileX + 1 * this.directionSign : this.tileX;
    const nextY = isHorizontal(this.direction) ? this.tileY : this.tileY + 1 * this.directionSign;

    const isRotating = !isNil(this.directionBuffer) && this.checkRotationTile(nextX, nextY);

    const nextNeighbours = getNeighboursCoordinates(nextX, nextY, this.map.length)
      .filter(([x, y]) => this.map[x][y] !== "W");

    if (nextNeighbours.length < 1 || !this.checkIsTileAllowed(nextX, nextY)) {
      return;
    }

    if (isRotating) {
      this.rotate(this.directionBuffer);
    }

    this.tileX = nextX;
    this.tileY = nextY;
    this.progress = 0;
  }

  eat() {
    const nextX = isHorizontal(this.direction) ? this.tileX + 1 * this.directionSign : this.tileX;
    const nextY = isHorizontal(this.direction) ? this.tileY : this.tileY + 1 * this.directionSign;

    const isNextFood = this.map[nextX][nextY] === "F";

    if (this.progress >= 0.4 && isNextFood) {
      Food.disassemble({ x: nextX, y: nextY, size: Food.size, ctx: fieldContext, cellSize: PACMAN_GRID_SIZE });
      this.map[nextX][nextY] = '-';
      this.trigger('player:eat');
    }
  }

  rotate(direction) {
    this.direction = direction;
    this.directionBuffer = null;
  }

  keyHandler = (event) => {
    const key = event.key;
    if (Object.keys(ROTATIONS)
      .includes(key)) {
      const newDirection = ROTATIONS[key];
      if (this.direction === newDirection) {
        return;
      }

      if (Math.abs(this.direction - newDirection) % 2 === 0) {
        this.progress = 1 - this.progress;
        this.rotate(newDirection);
        if (isHorizontal(this.direction)) {
          this.tileX += -1 * this.directionSign;
        } else {
          this.tileY += -1 * this.directionSign;
        }
      } else {
        this.directionBuffer = newDirection;
      }
    }
  };

  initControls() {
    window.addEventListener("keydown", this.keyHandler);
  }

  render() {
    this.eat();
    this.move();
    this.animate();
  }
}
