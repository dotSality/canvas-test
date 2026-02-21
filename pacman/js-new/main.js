
const field = document.getElementById("field");
const fieldContext = field.getContext("2d");

fieldContext.fillStyle = "blue";
fieldContext.fillRect(0, 0, field.width, field.height);
fieldContext.fillStyle = null;


const models = document.getElementById("models");
const modelsContext = models.getContext("2d");


const gui = document.getElementById("gui");
const guiContext = gui.getContext("2d");

const maze = new Maze(fieldContext);
maze.drawMaze();
console.log(maze.playerCell)
const player = new Player(maze.playerCell.x, maze.playerCell.y, VELOCITY, maze, modelsContext);

player.draw();