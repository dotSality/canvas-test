const Pages = {
  DEFAULT: "DEFAULT",
  SETTINGS: "SETTINGS",
  GAME: "GAME",
};

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
    [Pages.DEFAULT]: [],
    [Pages.SETTINGS]: [],
    [Pages.GAME]: [],
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
      { name: "Start", x1: middleX - 100, y1: 300, width: 200, height: 40 },
      { name: "Restart", x1: middleX - 100, y1: 350, width: 200, height: 40 },
      { name: "Settings", x1: middleX - 100, y1: 400, width: 200, height: 40 },
    ];
    this.#items[Pages.GAME] = [
      { name: "Score", x1: 20, width: 70, y1: 20, height: 60 },
      { name: "Lives", x1: this.width - 100, width: 80, y1: 20, height: 60 },
    ];
  }

  setContextForPage(page) {
    switch (page) {
      case Pages.DEFAULT:
      case Pages.GAME:
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "20px serif";
        break;
      default:
        break;
    }
  }

  drawDefaultItem(element, oldPath = null) {
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

  drawPage(page) {
    this.#paths[page] = [];
    this.currentPage = page;
    this.setContextForPage(page);
    this.#items[page].forEach((element) => {
      const path = this.currentDrawItemMethod(element);
      this.#paths[page].push(path);
    });
  }

  drawSettings() {

  }

  drawGameItem(element, oldPath = null) {
    const padding = 20;
    this.ctx.save();
    const path = oldPath ?? new Path2D();
    this.ctx.fillStyle = "#00000080";

    const text = this.ctx.measureText(element.name);

    path.roundRect(
      element.x1 + this.ctx.lineWidth / 2,
      element.y1 + this.ctx.lineWidth / 2,
      element.width - this.ctx.lineWidth,
      element.height - this.ctx.lineWidth,
      15
    );
    this.ctx.fill(path);
    this.ctx.stroke(path);

    const x1 = element.x1 + element.width / 2 - text.width / 2;
    const y1 = element.y1 + padding;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(element.name, x1, y1);
    this.ctx.restore();
    return path;
  }

  drawGame() {

  }

  get currentDrawItemMethod() {
    return {
      [Pages.DEFAULT]: (...args) => this.drawDefaultItem(...args),
      [Pages.SETTINGS]: () => {},
      [Pages.GAME]: (...args) => this.drawGameItem(...args),
    }[this.currentPage];
  }

  drawBackdrop(params) {
    this.ctx.fillStyle = "#00000040";
    if (params) {
      this.ctx.fillRect(params.x1, params.y1, params.width, params.height);
    } else {
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  registerEvents() {
    Object.values(this.#items).flat().forEach((item) => {
      this.on(`click:${item.name}`, () => {
        console.log("clicked: ", item.name);
      });
    });
    this.ctx.canvas.addEventListener("mousemove", (event) => this.handleHover(event));
    this.ctx.canvas.addEventListener("click", () => this.handleClick());
  }

  /**
   *
   * @param event {MouseEvent}
   */
  handleHover(event) {
    const { offsetX, offsetY } = event;

    const hoveringPath = this.#paths[this.currentPage].find((path) => this.ctx.isPointInPath(path, offsetX, offsetY));

    if (!hoveringPath) {
      if (!this.ctx.canvas.classList.contains("hovering")) return;

      this.ctx.canvas.classList.remove("hovering");
      const itemIndex = this.#paths[this.currentPage].findIndex((path) => path === this.hoveringPath);
      const item = this.#items[this.currentPage][itemIndex];
      this.ctx.clearRect(item.x1, item.y1, item.width, item.height);
      this.drawBackdrop({ x1: item.x1, y1: item.y1, width: item.width, height: item.height });
      this.setContextForPage(this.currentPage);
      this.currentDrawItemMethod(this.#items[this.currentPage][itemIndex], this.hoveringPath);
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
    this.drawBackdrop();
    // this.drawPage(Pages.DEFAULT);
    this.drawPage(Pages.GAME);
    this.registerEvents();
  }
}
