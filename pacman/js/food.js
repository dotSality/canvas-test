class Food {
  x;
  y;
  size;
  disassembled;
  hitBox;

  /**
   *
   * @param {number} x - abscissa
   * @param {number} y - ordinate
   * @param {number} size - painted object size
   * @param {CanvasRenderingContext2D} ctx - canvas's context
   */
  constructor(x, y, size, ctx) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.ctx = ctx;
    this.disassembled = false;
    this.hitBox = getHitBox(x, y, size);
  }

  paint(size = this.size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  clear(size, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);

  }

  create() {
    this.paint(this.size, "yellow");
    this.disassembled = false;
  }

  disassemble() {
    if (this.disassembled) return;

    const step = this.size / 8;
    let currentSize = this.size;
    const id = setInterval(() => {
      this.clear(currentSize + step, "blue");
      const newSize = currentSize - step;
      currentSize = (newSize <= 0.001 || newSize > currentSize) ? 0 : newSize;
      this.paint(currentSize, "yellow");
      if (currentSize <= 0) {
        clearInterval(id);
        this.disassembled = true;
      }
    }, 20);
  }
}
