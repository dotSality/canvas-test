class Food extends EventEmitter {
  x;
  y;
  size;
  disassembled;

  /**
   *
   * @param {number} x - abscissa
   * @param {number} y - ordinate
   * @param {number} size - painted object size
   * @param {number} cellSize - size of the cell where object is located
   * @param {CanvasRenderingContext2D} ctx - canvas's context
   */
  constructor(x, y, size, cellSize, ctx) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.cellSize = cellSize;
    this.ctx = ctx;
    this.disassembled = false;
  }

  paint() {
    this.ctx.save();
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();

    const x = (this.x + 0.5) * this.cellSize;
    const y = (this.y + 0.5) * this.cellSize;

    this.ctx.arc(x, y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(this.x, this.y, this.cellSize, this.cellSize);
  }

  create() {
    this.paint();
  }

  disassemble() {
    if (this.disassembled) return;

    this.disassembled = true;
    const step = this.size / 8;
    let currentSize = this.size;
    const id = setInterval(() => {
      this.clear("blue");
      const newSize = currentSize - step;
      this.size = (newSize <= 0.001 || newSize > currentSize) ? 0 : newSize;
      this.paint("yellow");
      if (currentSize <= 0) {
        clearInterval(id);
        this.trigger('disassembled');
      }
    }, 20);
  }
}
