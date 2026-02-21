/*
 * @deprecated refactor this
 */
const WALLS_TEMPLATE = [
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

class Maze {
    constructor(ctx) {
        this.ctx = ctx;
        this.objects = new Map();
        this.playerCell = null;
        this.grid = this.generateGrid();
    }

    isWall (x, y) {
        return this.grid[y][x] === GridLegend.WALL;
    };

    generateGrid () {
        const baseArray = Array.from({length: 30}, (_) => [])
            .map((_) => ' '.repeat(30).split(''));

        return baseArray.map((row, y, arrY) => {
            return row.map((_, x, arrX) => {
                const isWall = WALLS_TEMPLATE.find((block) => {
                    const [start, end] = block;
                    const [sx, sy] = start;
                    const [ex, ey] = end;
                    return (y <= ey && y >= sy) && (x <= ex && x >= sx);
                });

                if (isWall) {
                    return GridLegend.WALL;
                }

                if (!this.playerCell && Math.random() > 0.98) {
                    this.objects.set(`${x}-${y}`, {});

                    this.playerCell = {x, y};

                    return GridLegend.PLAYER;
                }

                const isLast = (arrY.length - 1 === y) && (arrX.length - 1 === x);
                if (!this.playerCell && isLast) {
                    this.objects.set(`${x}-${y}`, {});
                    this.playerCell = {x, y};

                    return GridLegend.PLAYER;
                }

                return GridLegend.EMPTY;
            })
        })
    }

    traverse(callback) {
        this.grid.forEach((row, y) => {
            return row.map((cell, x) => {
                callback(cell, x,y);
            })
        })
    }

    drawMaze() {
        this.traverse((cell, x,y) => {
            if (cell === GridLegend.WALL) {
                this.drawWall(x, y);
            }

            if (cell === GridLegend.EMPTY) {
                this.objects.set(`${x}-${y}`, new Food(x,y,this.objects, this.ctx));
            }
        })
    }

    drawWall (tileX, tileY) {
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff60";
        this.ctx.fillRect(tileX * GRID_CELL_SIZE + 1, tileY * GRID_CELL_SIZE + 1, GRID_CELL_SIZE - 2, GRID_CELL_SIZE - 2);
        this.ctx.restore();
    };
}