// TODO: remove the class, move template array to main.js
class Walls {
  /* basic approach - [[x1, y1], [x2, y2]] structured areas, '1' - start cell, '2' - end cell - */
  static template = [
    [[0, 0], [4, 8]],
    [[6, 0], [11, 3]],
    [[13, 0], [15, 8]],
    [[17, 0], [23, 2]],
    [[25, 0], [29, 13]],
    [[6, 5], [11, 13]],
    [[17, 4], [23, 13]],
    [[0, 10], [4, 18]],
    [[6, 15], [11, 25]],
    [[13, 10], [15, 25]],
    [[17, 15], [23, 25]],
    [[25, 15], [29, 25]],
    [[0, 20], [4, 29]],
    [[6, 27], [15, 29]],
    [[17, 27], [29, 29]],
  ];

  static isWalled(x, y) {
    const block = Walls.template.find(([p1, p2]) => {
      const [x1, y1] = p1, [x2, y2] = p2;
      const isWalledX = x >= x1 && x <= x2;
      const isWalledY = y >= y1 && y <= y2;
      return isWalledX && isWalledY;
    });

    return Boolean(block);
  }

  static drawWalls(ctx, cellSize) {
    ctx.save();
    ctx.fillStyle = '#ffffff60';
    // ctx.strokeStyle = "white";
    // ctx.strokeWidth = 2;
    Walls.template.forEach(([p1, p2]) => {
      const [x1, y1] = p1, [x2, y2] = p2;

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      }
      // const px1 = x1 * cellSize + cellSize / 2;
      // const px2 = x2 * cellSize + cellSize / 2;
      // const py1 = y1 * cellSize + cellSize / 2;
      // const py2 = y2 * cellSize + cellSize / 2;
      // ctx.beginPath();
      // ctx.roundRect(px1, py1, px2 - px1, py2 - py1, 5);
      // ctx.stroke();
    });
    ctx.restore();
  }
}
