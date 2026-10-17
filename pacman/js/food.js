/**
 * @typedef {Object} FoodOptions
 * @property {number} x - abscissa
 * @property {number} y - ordinate
 * @property {number} size - painted object size
 * @property {number} cellSize - size of the cell where object is located
 * @property {CanvasRenderingContext2D} ctx - canvas's context
 */

class Food extends EventEmitter {
  static size = 2;
  /**
   * @param {FoodOptions} options
   */
  static paint(options) {
    options.ctx.save();
    options.ctx.fillStyle = "yellow";
    options.ctx.beginPath();

    const canvasX = (options.x + 0.5) * options.cellSize;
    const canvasY = (options.y + 0.5) * options.cellSize;

    options.ctx.arc(canvasX, canvasY, options.size, 0, Math.PI * 2);
    options.ctx.fill();
    options.ctx.restore();
  }

  /**
   * @param {FoodOptions} options
   */
  static clear(options) {
    options.ctx.save();
    options.ctx.fillStyle = "blue";
    options.ctx.fillRect(options.x * options.cellSize, options.y * options.cellSize, options.cellSize, options.cellSize);
    options.ctx.restore();
  }

  /**
   * @param {FoodOptions} options
   */
  static disassemble(options) {
    const step = options.size / 8;
    let currentSize = options.size;
    const id = setInterval(() => {
      Food.clear(options);
      const newSize = currentSize - step;
      currentSize = (newSize <= 0.001 || newSize > currentSize) ? 0 : newSize;
      if (currentSize <= 0) {
        clearInterval(id);
        return;
      }
      Food.paint({ ...options, size: newSize });
    }, 20);
  }
}
