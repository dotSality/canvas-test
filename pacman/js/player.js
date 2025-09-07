const VELOCITY = 0.5;

const isCollided = (hitBox, boundary, direction) => {
  const collidedBottom = hitBox.y2 >= boundary.y && direction === DIRECTION.Down;
  const collidedTop = hitBox.y1 <= 0 && direction === DIRECTION.Up;
  const collidedLeft = hitBox.x1 <= 0 && direction === DIRECTION.Left;
  const collidedRight = hitBox.x2 >= boundary.x && direction === DIRECTION.Right;

  const deltaUp = collidedTop ? 0 : -VELOCITY;
  const deltaDown = collidedBottom ? 0 : VELOCITY;
  const deltaRight = collidedRight ? 0 : VELOCITY;
  const deltaLeft = collidedLeft ? 0 : -VELOCITY;

  const isHorizontal = direction === DIRECTION.Left || direction === DIRECTION.Right;
  const isVertical = direction === DIRECTION.Up || direction === DIRECTION.Down;

  const deltaX = isHorizontal ? (direction === DIRECTION.Left ? deltaLeft : deltaRight) : 0;
  const deltaY = isVertical ? (direction === DIRECTION.Up ? deltaUp : deltaDown) : 0;

  return { deltaX, deltaY };
};

const ROTATIONS = {
  ArrowRight: DIRECTION.Right,
  ArrowDown: DIRECTION.Down,
  ArrowLeft: DIRECTION.Left,
  ArrowUp: DIRECTION.Up,
};

class Player {
  x;
  y;
  r;
  alive;
  opening;
  ctx;
  #openingDelta = 1;
  direction;

  constructor(x, y, size, opening, ctx, direction = DIRECTION.Up) {
    this.x = x;
    this.y = y;
    this.r = size / 2;
    this.ctx = ctx;
    this.opening = opening;
    this.alive = true;
    this.direction = direction;
  }

  get hitBox() {
    return getHitBox(this.x, this.y, this.r * 2);
  }

  paint(opening, erase = false) {
    const angle = Math.PI * (opening / 100);

    const rotationAngle = (this.direction * Math.PI * 2) / 4;

    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(
      this.x,
      this.y,
      this.r,
      angle + rotationAngle,
      2 * Math.PI - angle + rotationAngle,
      erase
    );
    this.ctx.closePath();
    this.ctx.fill();
  }

  create() {
    this.paint(0);

    this.ctx.globalCompositeOperation = "destination-out";

    this.paint(this.opening, true);

    this.ctx.globalCompositeOperation = "source-out";

    this.initControls();
  }

  animate() {
    if (this.opening <= 0 || this.opening >= 30) this.#openingDelta *= -1;
    this.opening += this.#openingDelta;

    this.ctx.clearRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);

    this.paint(0);
    this.ctx.globalCompositeOperation = "destination-out";

    this.paint(this.opening, true);

    this.ctx.globalCompositeOperation = "source-out";
  }

  disassemble() {
    window.removeEventListener("keydown", this.keyHandler);
  }

  move() {
    const boundary = { x: this.ctx.canvas.width, y: this.ctx.canvas.height };
    const { deltaX, deltaY } = isCollided(this.hitBox, boundary, this.direction);
    this.x += deltaX;
    this.y += deltaY;
  }

  rotate(direction) {
    this.direction = direction;
  }

  keyHandler = (event) => {
    const key = event.key
    if (Object.keys(ROTATIONS).includes(key)) {
      this.rotate(ROTATIONS[key]);
    }
  }

  initControls() {
    window.addEventListener("keydown", this.keyHandler);
  }

  render() {
    this.move();
    this.animate();
  }
}
