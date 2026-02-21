/*
 * Base class for every moving object
 */
class Entity {
    constructor(x, y, speed, maze) {
        this.tileX = x;
        this.tileY = y;
        this.speed = speed * window.devicePixelRatio;
        this.maze = maze;
        this.direction = null;
        this.nextDirection = null;
        this.progress = 0;
    }

    get pixelCoordinates() {
        const horizontalProgress = isHorizontal(this.direction) ? this.progress : 0;
        const verticalProgress = isVertical(this.direction) ? this.progress : 0;
        return {
            x: (this.tileX + horizontalProgress) * GRID_CELL_SIZE,
            y: (this.tileY + verticalProgress) * GRID_CELL_SIZE,
        };
    }

    checkCollision(entity) {
        if (!entity) {
            return false;
        }

        const {x,y} = this.pixelCoordinates;
        const {x: entityX, y: entityY} = entity.pixelCoordinates;
        return (Math.abs(x - entityX) <= GRID_CELL_SIZE / 2) && (Math.abs(y - entityY) <= GRID_CELL_SIZE / 2);
    }

    update(dt) {
        this.progress += this.speed;
    }

    render(ctx) {
        throw new Error('[entity:render] not implemented')
    }
}