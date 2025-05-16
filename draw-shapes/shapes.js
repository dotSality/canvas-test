const width = 500,
  height = 500,
  fillMargin = 25,
  fillSize = 100,
  clearMargin = 45,
  clearSize = 60,
  strokeMargin = 50,
  strokeSize = 50;

const drawShapes = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  ctx.fillRect(fillMargin, fillMargin, fillSize, fillSize);
  ctx.clearRect(clearMargin, clearMargin, clearSize, clearSize);
  ctx.strokeRect(strokeMargin, strokeMargin, strokeSize, strokeSize);

  ctx.fillRect(width - fillSize - fillMargin, height - fillSize - fillMargin, fillSize, fillSize);
  ctx.clearRect(width - clearMargin - clearSize, width - clearMargin - clearSize, clearSize, clearSize);
  ctx.strokeRect(width - strokeMargin - strokeSize, width - strokeMargin - strokeSize, strokeSize, strokeSize);

  ctx.fillRect(width - fillSize - fillMargin, fillMargin, fillSize, fillSize);
  ctx.clearRect(width - clearMargin - clearSize, clearMargin, clearSize, clearSize);
  ctx.strokeRect(width - strokeMargin - strokeSize, strokeMargin, strokeSize, strokeSize);

  ctx.fillRect(fillMargin, height - fillSize - fillMargin, fillSize, fillSize);
  ctx.clearRect(clearMargin, height - clearMargin - clearSize, clearSize, clearSize);
  ctx.strokeRect(strokeMargin, height - strokeMargin - strokeSize, strokeSize, strokeSize);
};

window.addEventListener("load", drawShapes);
