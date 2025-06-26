const drawPaths = () => {
  const canvas = document.getElementById("canvas");
  const middle = canvas.width / 2;
  const dots = [
    [middle + 10, middle - 10],
    [middle + 45, middle - 15],
    [middle + 15, middle + 5],
    [middle + 30, middle + 40],
    [middle, middle + 15],
    [middle - 30, middle + 40],
    [middle - 15, middle + 5],
    [middle - 45, middle - 15],
    [middle - 10, middle - 10],
  ];

  const drawDot = (([x, y]) => ctx.lineTo(x, y));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(middle, middle - 50);
  dots.forEach(drawDot);
  ctx.closePath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.fill();
};

window.addEventListener("load", drawPaths);
