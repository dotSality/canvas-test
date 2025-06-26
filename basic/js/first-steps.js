const checkCollision = (value, limit) => value >= limit || value <= 0;
const getStartCoordinate = (size) => Math.trunc(Math.random() * size);
const getDelta = () => Math.random() >= 0.5 ? 1 : -1

const draw = () => {
  let size = 20;
  let deltaX = getDelta();
  let deltaY = getDelta();
  const canvas = document.getElementById("canvas");
  let x = getStartCoordinate(canvas.width - size);
  let y = getStartCoordinate(canvas.height - size);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  setInterval(() => {
    ctx.clearRect(x, y, size, size);
    x += deltaX;
    y += deltaY;
    deltaX *= checkCollision(x, canvas.width - size) ? -1 : 1;
    deltaY *= checkCollision(y, canvas.height - size) ? -1 : 1;
    ctx.fillRect(x, y, size, size);
  }, 10);
};

window.addEventListener("load", draw);
