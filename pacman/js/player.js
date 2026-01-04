const ROTATIONS = {
  ArrowRight: DIRECTION.Right,
  ArrowDown: DIRECTION.Down,
  ArrowLeft: DIRECTION.Left,
  ArrowUp: DIRECTION.Up,
};

const isHorizontal = (direction) => [DIRECTION.Left, DIRECTION.Right].includes(direction);
const isVertical = (direction) => [DIRECTION.Up, DIRECTION.Down].includes(direction);

class Player {
  tileX;
  tileY;
  r;
  alive;
  ctx;
  direction;
  directionBuffer;
  progress = 0.5;

  velocity;

  opening;
  #openingDelta = 1;

  allowedRotation = false;

  constructor(tileX, tileY, size, opening, ctx, direction = DIRECTION.Up, velocity = 1) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.r = size / 2;
    this.ctx = ctx;
    this.opening = opening;
    this.alive = true;
    this.direction = direction;
    this.velocity = velocity;
  }

  paint(opening) {
    const angle = Math.PI * (opening / 100);

    const centerX = ((isHorizontal(this.direction) ? this.progress : 0.5) + this.tileX) * PACMAN_GRID_SIZE;
    const centerY = ((isVertical(this.direction) ? this.progress : 0.5) + this.tileY) * PACMAN_GRID_SIZE;

    const rotationAngle = (this.direction * Math.PI * 2) / 4;
    this.ctx.save();

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
    if (this.opening <= 0 || this.opening >= 30) this.#openingDelta *= -1;
    this.opening += this.#openingDelta;

    this.paint(this.opening);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  disassemble() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  move() {
    if (this.progress >= 100) {
      this.direction = this.directionBuffer;
      this.directionBuffer = null;
    }
  }

  keyHandler = (event) => {
    const key = event.key;
    if (Object.keys(ROTATIONS).includes(key)) {
      const newDirection = ROTATIONS[key];
      // if (Math.abs(this.direction - newDirection) % 2 === 0) {
        this.direction = newDirection;
      console.log(newDirection);
      // } else {
      //   this.directionBuffer = newDirection;
      // }
    }
  };

  checkRotation() {

  }

  // TODO: block listener initialization until paused/not started
  initControls() {
    window.addEventListener("keydown", this.keyHandler);
  }

  render() {
    this.move();
    this.animate();
  }
}
