const Rotations = {
    ArrowRight: Direction.RIGHT,
    ArrowDown: Direction.DOWN,
    ArrowLeft: Direction.LEFT,
    ArrowUp: Direction.UP,
};

class Player extends Entity {
    #opening;
    #openingDelta;

    constructor(tileX, tileY, speed, maze, ctx) {
        super(tileX, tileY, speed, maze);

        const emptyNeighbours = getNeighboursCoordinates(tileX, tileY)
            .filter(([x,y]) => {
                const cell = this.maze.grid[y][x];
                return cell !== GridLegend.WALL;
            });
        const [dirX, dirY] = emptyNeighbours.at(random(0, emptyNeighbours.length - 1));

        if (dirY === tileY) {
            this.direction = dirX > tileX ? Direction.RIGHT : Direction.LEFT;
        } else {
            this.direction = dirY < tileY ? Direction.UP : Direction.DOWN;
        }
        this.maze.objects.set(`${this.tileX}-${this.tileY}`, this);

        this.progress = 0;
        this.r = 10;
        this.ctx = ctx;
        this.#opening = 30;
        this.#openingDelta = 1;
    }

    draw() {
        const deltaX = isHorizontal(this.direction) ? this.progress * this.directionSign : 0;
        const deltaY = isVertical(this.direction) ? this.progress * this.directionSign : 0;

        const centerX = (deltaX + 0.5 + this.tileX) * GRID_CELL_SIZE;
        const centerY = (deltaY + 0.5 + this.tileY) * GRID_CELL_SIZE;

        const rotationAngle = (this.direction * Math.PI * 2) / 4;
        this.ctx.save();

        const angle = Math.PI * (this.#opening / 100);
        this.ctx.fillStyle = "yellow";
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(
            centerX,
            centerY,
            this.r,
            angle + rotationAngle,
            2 * Math.PI - angle + rotationAngle,
        );
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    get directionSign() {
        return isDirectionNegative(this.direction) ? -1 : 1;
    }

    animate() {
        this.clear();
        if (this.#opening <= 0 || this.#opening >= 30) {
            this.#openingDelta *= -1;
        }
        this.#opening += this.#openingDelta;

        this.draw();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    disassemble() {
        window.removeEventListener("keydown", this.keyHandler);
    }

    move() {
        const nextProgress = this.progress + this.speed * 0.1;
        // TODO: add next cell check for wall or food or etc.
        if (nextProgress < 1) {
            this.progress = nextProgress;

            return;
        }

        if (isHorizontal(this.direction)) {
            this.tileX += 1 * this.directionSign;
        } else {
            this.tileY += 1 * this.directionSign;
        }
        this.progress = 0;

        if (!isNil(this.directionBuffer)) {
            this.rotate(this.directionBuffer);
        }
    }

    rotate(direction) {
        this.direction = direction;
        this.directionBuffer = null;
    }

    keyHandler = (event) => {
        const key = event.key;
        if (Object.keys(Rotations).includes(key)) {
            const newDirection = Rotations[key];
            if (this.direction === newDirection) {
                return;
            }

            if (Math.abs(this.direction - newDirection) % 2 === 0) {
                this.progress = 1 - this.progress;
                this.rotate(newDirection);
                if (isHorizontal(this.direction)) {
                    this.tileX += -1 * this.directionSign;
                } else {
                    this.tileY += -1 * this.directionSign;
                }
            } else {
                this.directionBuffer = newDirection;
            }
        }
    };

    initControls() {
        window.addEventListener("keydown", this.keyHandler);
    }

    // TODO: refactor moving logic with using it inside the main render, add bool checks
    render() {
        this.move();
        this.animate();
    }
}