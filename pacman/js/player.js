const ROTATIONS = {
  ArrowRight: DIRECTION.Right,
  ArrowDown: DIRECTION.Down,
  ArrowLeft: DIRECTION.Left,
  ArrowUp: DIRECTION.Up,
};

const isHorizontal = (direction) => [DIRECTION.Left, DIRECTION.Right].includes(direction);
const isVertical = (direction) => [DIRECTION.Up, DIRECTION.Down].includes(direction);
const isDirectionNegative = (direction) => [DIRECTION.Up, DIRECTION.Left].includes(direction);

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

  constructor(tileX, tileY, size, opening, ctx, direction = DIRECTION.Up, velocity = 1) {
    super();

    this.tileX = tileX;
    this.tileY = tileY;
    this.r = size / 2;
    this.ctx = ctx;
    this.opening = opening;
    this.alive = true;
    this.direction = direction;
    this.velocity = velocity;
    this.progress = 0;
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

  get directionSign() {
    return isDirectionNegative(this.direction) ? -1 : 1;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  disassemble() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  move() {
    const nextProgress = this.progress + this.velocity * 0.1;

    if (nextProgress < 1) {
      this.progress = nextProgress;

      return;
    }

    if (isHorizontal(this.direction)) {
      this.progress = 0;
      this.tileX += 1 * this.directionSign;
    } else {
      this.progress = 0;
      this.tileY += 1 * this.directionSign;
    }

    if (!isNil(this.directionBuffer)) {
      this.rotate(this.directionBuffer);
    }
  }

  rotate(direction) {
    this.direction = direction;
    this.directionBuffer = null;
  }

  keyHandler = (event) => {
    const key = event.key;
    if (Object.keys(ROTATIONS).includes(key)) {
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

  // TODO: refactor moving logic with using it inside the main render, add bool checks
  render() {
    this.move();
    this.animate();
  }
}
