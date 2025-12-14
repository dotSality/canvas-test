const Pages = {
  DEFAULT: "DEFAULT",
  SETTINGS: "SETTINGS",
  GAME: "GAME",
};
const PADDING = 5;
const HEART_PATH = "M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z";

const getPathBoundaryBox = (d) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", d);
  svg.appendChild(path);
  svg.setAttribute("style", "position:absolute; left:-9999px; top:-9999px; visibility:hidden;");
  document.body.appendChild(svg);

  const bbox = path.getBBox();

  svg.remove();

  return bbox;
};

const getHeartPathMeta = () => ({
  count: 3,
  gap: 3,
  scale: 0.15,
  path: HEART_PATH,
  pathBox: getPathBoundaryBox(HEART_PATH),
});

class Gui extends EventEmitter {
  hoveringPath;

  ctx;
  currentPage;

  #items = {
    [Pages.DEFAULT]: [],
    [Pages.SETTINGS]: [],
    [Pages.GAME]: [],
  };

  #paths = {
    [Pages.DEFAULT]: null,
    [Pages.SETTINGS]: null,
    [Pages.GAME]: null,
  };

  constructor(ctx) {
    super();

    this.ctx = ctx;
    this.currentPage = Pages.DEFAULT;
    const { width, height } = this.ctx.canvas;
    this.width = width;
    this.height = height;
    this.createItems();

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, 30);
  }

  createItems() {
    const middleX = this.width / 2;
    this.#items[Pages.DEFAULT] = [
      { name: "Start", x1: middleX - 100, y1: 300, width: 200, height: 40, interactive: true },
      { name: "Restart", x1: middleX - 100, y1: 350, width: 200, height: 40, interactive: true },
      { name: "Settings", x1: middleX - 100, y1: 400, width: 200, height: 40, interactive: true },
    ];
  }

  drawInteractiveItem(element, oldPath = null) {
    this.ctx.save();
    const path = oldPath ?? new Path2D();
    this.ctx.fillStyle = "#00000080";
    path.roundRect(
      element.x1 + this.ctx.lineWidth / 2,
      element.y1 + this.ctx.lineWidth / 2,
      element.width - this.ctx.lineWidth,
      element.height - this.ctx.lineWidth,
      15
    );

    const text = this.ctx.measureText(element.name);
    const x1 = element.x1 + element.width / 2 - text.width / 2;
    const y1 = element.y1 + element.height / 2;
    this.ctx.fill(path);
    this.ctx.stroke(path);
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(element.name, x1, y1);
    this.ctx.restore();
    return path;
  }

  drawDefaultPage() {
    const page = Pages.DEFAULT;

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "20px serif";
    this.ctx.canvas.classList.add("backdrop");

    this.currentPage = page;
    this.#items[page].forEach((element) => {
      const path = this.drawInteractiveItem(element);
      if (!this.#paths[page]) {
        this.#paths[page] = [];
      }
      this.#paths[page].push(path);
    });
  }

  clearDefaultPage() {
    this.ctx.clearRect(0, 30, this.ctx.canvas.width, this.ctx.canvas.height - 30);
    this.ctx.canvas.classList.remove("hovering");
    this.#items[Pages.DEFAULT] = null;
  }

  drawGamePage() {
    const page = Pages.GAME;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "20px serif";
    this.ctx.canvas.classList.remove("backdrop");
    this.currentPage = page;

    this.drawGameScoreLabel();
    this.drawGameScoreValue();

    this.drawLivesLabel();
    this.drawLivesValue();

    this.on("printScore", (value) => {
      this.drawGameScoreValue(value);
    });
  }

  drawSettings() {

  }

  drawGameScoreLabel() {
    this.ctx.save();
    const labelX1 = 20;
    const labelY1 = PADDING;
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Score:", labelX1, labelY1);
    this.ctx.restore();
  }

  drawGameScoreValue(count = 0) {
    this.ctx.save();
    let scoreString = count.toString();
    while (scoreString.length < 5) {
      scoreString = "0" + scoreString;
    }

    const labelMeta = this.ctx.measureText("Score:");
    const valueMeta = this.ctx.measureText(scoreString);
    const x1 = 20 + labelMeta.width + 5;
    const y1 = PADDING;
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(x1 - 1, y1, valueMeta.width + 1, 20);
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(scoreString, x1, y1);
    this.ctx.restore();

    this.unregisterEvents();
  }

  drawLivesLabel() {
    this.ctx.save();
    const { pathBox, scale, gap, count } = getHeartPathMeta();
    const heartsWidth = (pathBox.width * count + gap * (count - 1)) * scale;
    const labelMeta = this.ctx.measureText("Lives:");
    const labelX1 = this.ctx.canvas.width - 20 - labelMeta.width - heartsWidth - 9;
    const labelY1 = PADDING;
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Lives:", labelX1, labelY1);
    this.ctx.restore();
  }

  drawLivesValue() {
    this.ctx.save();
    const { count, gap, path, pathBox, scale } = getHeartPathMeta();
    const heartOffsetX = 6;
    this.ctx.textBaseline = "top";
    const resultPath = new Path2D();
    const x1 = this.ctx.canvas.width - 20 - (pathBox.width * count + gap * (count - 1)) * scale;

    for (let i = 0 ; i < count ; i += 1) {
      resultPath.addPath(
        new Path2D(path),
        new DOMMatrix()
          .translate(
            x1 - heartOffsetX + (pathBox.width * scale + gap) * i,
            PADDING)
          .scale(scale, scale));
    }

    this.ctx.fillStyle = "red";
    this.ctx.fill(resultPath);
    this.ctx.restore();
  }

  registerEvents() {
    Object.values(this.#items).flat().forEach((item) => {
      this.on(`click:${item.name}`, () => {
        this.trigger(item.name.toLowerCase());
      });
    });
    this.ctx.canvas.addEventListener("mousemove", this.handleHover);
    this.ctx.canvas.addEventListener("click", this.handleClick);

    this.on('start', () => {
      this.clearDefaultPage();
      this.drawGamePage();
    })
  }

  unregisterEvents() {
    this.ctx.canvas.removeEventListener("mousemove", this.handleHover);
    this.ctx.canvas.removeEventListener("click", this.handleClick);
  }

  /**
   *
   * @param event {MouseEvent}
   */
  handleHover = (event) => {
    const { offsetX, offsetY } = event;

    const paths = this.#paths[this.currentPage];
    if (!paths) {
      return;
    }
    const hoveringPath = paths.find((path) => this.ctx.isPointInPath(path, offsetX, offsetY));

    if (!hoveringPath) {
      if (!this.ctx.canvas.classList.contains("hovering")) return;

      this.ctx.canvas.classList.remove("hovering");
      const itemIndex = this.#paths[this.currentPage].findIndex((path) => path === this.hoveringPath);
      const item = this.#items[this.currentPage][itemIndex];
      this.ctx.clearRect(item.x1, item.y1, item.width, item.height);
      this.drawInteractiveItem(this.#items[this.currentPage][itemIndex], this.hoveringPath);
      this.hoveringPath = null;
      return;
    }

    if (this.ctx.canvas.classList.contains("hovering")) return;
    this.hoveringPath = hoveringPath;
    this.ctx.canvas.classList.add("hovering");
    this.ctx.fillStyle = "#ffffff30";
    this.ctx.fill(this.hoveringPath);
    this.ctx.stroke(this.hoveringPath);
  };

  handleClick = () => {
    if (!this.hoveringPath) return;

    const pathIndex = this.#paths[this.currentPage].findIndex((path) => path === this.hoveringPath);
    const item = this.#items[this.currentPage][pathIndex];
    this.trigger(`click:${item.name}`);
  };

  init() {
    this.drawDefaultPage();
    // this.drawGamePage();
    this.registerEvents();
  }
}
