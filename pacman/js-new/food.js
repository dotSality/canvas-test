class Food {
  size;
  disassembled;

  constructor(tileX, tileY, objects, ctx) {
    this.tileX = tileX;
    this.tileY = tileY;
    this.size = 2;
    this.cellSize = GRID_CELL_SIZE;
    this.ctx = ctx;
    this.objects = objects;
    this.disassembled = false;

    this.create();
  }

  paint() {
    this.ctx.save();
    this.ctx.fillStyle = "yellow";
    this.ctx.beginPath();

    const x = (this.tileX + 0.5) * GRID_CELL_SIZE;
    const y = (this.tileY + 0.5) * GRID_CELL_SIZE;

    this.ctx.arc(x, y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(this.tileX, this.tileY, GRID_CELL_SIZE, GRID_CELL_SIZE);
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
      this.clear();
      const newSize = currentSize - step;
      this.size = (newSize <= 0.001 || newSize > currentSize) ? 0 : newSize;
      this.paint();
      if (currentSize <= 0) {
        clearInterval(id);
        this.objects.delete(`${this.tileX}-${this.tileY}`);
      }
    }, 20);
  }
}
