class Enemy {
  x;
  y;
  size;
  alive;
  ctx;
  #step = 1;
  #delta = 0;
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

    window.addEventListener("keydown", (event) => {
      const key = event.key;
      if (Object.keys(ROTATIONS).includes(key)) {
        this.rotate(ROTATIONS[key]);
      }
    });
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

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";

    const eyeRadiusX = r / 4;
    const eyeRadiusY = r / 10 * 3.5;

    const eyeDefaultLeftX = this.x - r / 2.5;
    const eyeDefaultRightX = this.x + r / 2.5;
    const eyeDefaultY = this.y - eyeRadiusY / 2;
    const eyeTiltedDeltaX = this.direction === DIRECTION.Left ? -eyeRadiusX / 2 : eyeRadiusX / 2;
    const eyeTiltedDeltaY = this.direction === DIRECTION.Up ? -eyeRadiusY / 2 : eyeRadiusY / 2;

    const isTiltedX = [DIRECTION.Left, DIRECTION.Right].includes(this.direction);
    const isTiltedY = [DIRECTION.Up, DIRECTION.Down].includes(this.direction);

    const eyeLeftX = eyeDefaultLeftX + (isTiltedX ? eyeTiltedDeltaX : 0);
    const eyeRightX = eyeDefaultRightX + (isTiltedX ? eyeTiltedDeltaX : 0);

    const eyeY = eyeDefaultY + (isTiltedY ? eyeTiltedDeltaY : 0);

    this.ctx.ellipse(eyeLeftX, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, 2 * Math.PI);
    this.ctx.ellipse(eyeRightX, eyeY, eyeRadiusX, eyeRadiusY, 0, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "black";

    const pupilTiltedDeltaX = this.direction === DIRECTION.Left ? -eyeRadiusX / 4 : eyeRadiusX / 4;
    const pupilLeftX = eyeLeftX + (isTiltedX ? pupilTiltedDeltaX : 0);
    const pupilRightX = eyeRightX + (isTiltedX ? pupilTiltedDeltaX : 0);
    const pupilY = eyeY + (isTiltedY ? (this.direction === DIRECTION.Up ? -eyeRadiusY / 4 : eyeRadiusY / 4) : 0);

    this.ctx.arc(pupilLeftX, pupilY, eyeRadiusX / 2, 0, 2 * Math.PI);
    this.ctx.arc(pupilRightX, pupilY, eyeRadiusX / 2, 0, 2 * Math.PI);

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
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
    // this.move();
    this.animate();
    if (this.#delta >= 0.4) {
      this.#delta = 0;
      this.#step *= -1;
    }
  }
}
