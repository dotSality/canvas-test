
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

const player = new Player()