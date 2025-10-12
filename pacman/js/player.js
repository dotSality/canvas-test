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
  velocity;
  #paused;

  constructor(x, y, size, opening, ctx, direction = DIRECTION.Up, velocity = 1) {
    this.x = x;
    this.y = y;
    this.r = size / 2;
    this.ctx = ctx;
    this.opening = opening;
    this.alive = true;
    this.direction = direction;
    this.velocity = velocity;
  }

  get hitBox() {
    return getHitBox(this.x, this.y, this.r * 2);
  }

  paint(opening) {
    const angle = Math.PI * (opening / 100);

    const rotationAngle = (this.direction * Math.PI * 2) / 4;

    this.ctx.save();

    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(
      this.x,
      this.y,
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

    this.initControls();
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
    if (this.#paused) return;
    window.removeEventListener("keydown", this.keyHandler);
  }

  move() {
    const boundary = { x: this.ctx.canvas.width, y: this.ctx.canvas.height };
    const { deltaX, deltaY } = isCollided(this.hitBox, boundary, this.direction, this.velocity);
    this.x += deltaX;
    this.y += deltaY;
  }

  rotate(direction) {
    this.direction = direction;
  }

  keyHandler = (event) => {
    if (this.#paused) return;
    const key = event.key;
    if (Object.keys(ROTATIONS).includes(key)) {
      this.rotate(ROTATIONS[key]);
    }
  };

  initControls() {
    window.addEventListener("keydown", this.keyHandler);
  }

  render() {
    if (this.#paused) return;
    this.move();
    this.animate();
  }
}
