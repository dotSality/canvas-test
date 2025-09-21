class Enemy {
  x;
  y;
  size;
  alive;
  ctx;
  #step = 1;
  #delta;
  direction;
  velocity;

  constructor(x, y, size, ctx, direction = DIRECTION.Up, velocity = 1) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
    this.alive = true;
    this.direction = direction;
    this.velocity = velocity;
  }

  get hitBox() {
    return getHitBox(this.x, this.y, this.size);
  }

  paint() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";

    const r = this.size / 2;
    const deltaYForLeg = r / 2;
    const deltaXForLeg = r / 3;

    this.ctx.moveTo(this.x, this.y);
    this.ctx.arc(this.x, this.y, r, Math.PI, 0);
    this.ctx.moveTo(this.x + r, this.y);
    this.ctx.lineTo(this.x + r, this.y + r - deltaYForLeg);

    if (this.#step > 0) {
      this.ctx.lineTo(this.x + 2 * deltaXForLeg, this.y + r);
      this.ctx.lineTo(this.x + deltaXForLeg, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x, this.y + r);
      this.ctx.lineTo(this.x - deltaXForLeg, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x - 2 * deltaXForLeg, this.y + r);
      this.ctx.lineTo(this.x - r, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x - r, this.y);
    } else {
      this.ctx.lineTo(this.x + r, this.y + r);
      this.ctx.lineTo(this.x + 2 * deltaXForLeg, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x + deltaXForLeg, this.y + r);
      this.ctx.lineTo(this.x, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x - deltaXForLeg, this.y + r);
      this.ctx.lineTo(this.x - 2 * deltaXForLeg, this.y + r - deltaYForLeg);
      this.ctx.lineTo(this.x - r, this.y + r);
      this.ctx.lineTo(this.x - r, this.y);
    }
    // this.ctx.lineTo(this.x - r, this.y + r - deltaYForLeg);
    // this.ctx.lineTo(this.x - r, this.y);

    // this.ctx.moveTo(83, 116);
    // this.ctx.lineTo(83, 102);
    // this.ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    // this.ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    // this.ctx.lineTo(111, 116);
    //
    // this.ctx.lineTo(106.333, 111.333);
    // this.ctx.lineTo(101.666, 116);
    // this.ctx.lineTo(97, 111.333);
    // this.ctx.lineTo(92.333, 116);
    // this.ctx.lineTo(87.666, 111.333);
    // this.ctx.lineTo(83, 116);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  create() {
    this.paint();
  }

  animate() {
    this.paint();
  }

  clear() {

  }

  disassemble() {
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

  render(delta) {
    this.#delta += delta;
    this.clear();
    // this.move();
    this.animate();
    if (this.#delta >= 0.5) {
      this.#delta = 0;
      this.#step *= -1;
    }
  }
}
