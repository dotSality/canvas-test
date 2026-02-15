class Player extends Entity {
    constructor(tileX, tileY, speed, maze) {
        super(tileX, tileY, speed, maze);

        const {} = this.getStartCell(flatGrid);

        const emptyNeighbours = getNeighboursCoordinates(playerX, playerY)
            .filter(([x,y]) => {
                const cell = this.maze.grid[y][x];
                return cell !== GridLegend.WALL;
            });

        this.direction;
    }

    getStartCell(cells) {
        return cells.at(random(0, cells.length - 1));
    }
}