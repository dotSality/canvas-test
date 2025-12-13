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
  }

  createItems() {
    const middleX = this.width / 2;
    this.#items[Pages.DEFAULT] = [
      { name: "Start", x1: middleX - 100, y1: 300, width: 200, height: 40, interactive: true },
      { name: "Restart", x1: middleX - 100, y1: 350, width: 200, height: 40, interactive: true },
      { name: "Settings", x1: middleX - 100, y1: 400, width: 200, height: 40, interactive: true },
    ];
    this.#items[Pages.GAME] = [
      { name: "Score", x1: 20, width: 70, y1: 10, height: 30, interactive: false },
      { name: "Lives", x1: this.width - 100, width: 80, y1: 10, height: 30, interactive: false },
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
    const page = Pages.DEFAULT

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

  drawGamePage() {
    const page = Pages.GAME;

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "20px serif";
    this.ctx.canvas.classList.remove("backdrop");

    this.currentPage = page;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, 50);

    this.#items[page].forEach((element) => {
      this.drawGameItem(element);
    });
  }

  drawSettings() {

  }

  drawGameScore(element, count = 0) {
    this.ctx.save();
    let scoreString = count.toString();
    while (scoreString.length < 5) {
      scoreString = "0" + scoreString;
    }

    const valueMeta = this.ctx.measureText(scoreString);
    const x1 = element.x1 + element.width / 2 - valueMeta.width / 2;
    const y1 = element.y1 + element.height / 2 + PADDING * 2;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(x1, y1 - PADDING * 2, valueMeta.width, 20);
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(scoreString, x1, y1);
    this.ctx.restore();

    this.unregisterEvents();
  }

  drawLives(element, textMeta) {
    this.ctx.save();
    const { count, gap, path, pathBox, scale } = getHeartPathMeta();

    const resultPath = new Path2D();
    const x1 = element.x1 + element.width / 2 - textMeta.width / 2;
    const y1 = element.y1 + PADDING * 2;

    for (let i = 0 ; i < count ; i += 1) {
      resultPath.addPath(
        new Path2D(path),
        new DOMMatrix()
          .translate(
            x1 - pathBox.x + (pathBox.width * scale + gap) * i,
            y1 + PADDING / 2)
          .scale(scale, scale));
    }

    this.ctx.fillStyle = "red";
    this.ctx.fill(resultPath);
    this.ctx.restore();
  }

  drawGameItem(element) {
    this.ctx.save();

    const labelMeta = this.ctx.measureText(element.name);
    const labelX1 = element.x1 + element.width / 2 - labelMeta.width / 2;
    const labelY1 = element.y1 + PADDING;
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(element.name, labelX1, labelY1);
    this.ctx.restore();

    if (element.name === "Score") {
      this.drawGameScore(element);
      this.on("printScore", (value) => {
        this.drawGameScore(element, value);
      });
    } else {
      this.drawLives(element, labelMeta);
    }
  }

  registerEvents() {
    Object.values(this.#items).flat().forEach((item) => {
      this.on(`click:${item.name}`, () => {
        console.log("clicked: ", item.name);
      });
    });
    this.ctx.canvas.addEventListener("mousemove", this.handleHover);
    this.ctx.canvas.addEventListener("click", this.handleClick);
  }

  unregisterEvents() {
    this.ctx.canvas.removeEventListener("mousemove", this.handleHover);
    this.ctx.canvas.removeEventListener("click", this.handleClick);
  }

  /**
   *
   * @param event {MouseEvent}
   */
  handleHover(event) {
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
  }

  handleClick() {
    if (!this.hoveringPath) return;

    const pathIndex = this.#paths[this.currentPage].findIndex((path) => path === this.hoveringPath);
    const item = this.#items[this.currentPage][pathIndex];
    this.trigger(`click:${item.name}`);
  }

  init() {
    // this.drawDefaultPage();
    this.drawGamePage();
    this.registerEvents();
  }
}
