class Interactable extends EventEmitter {
  x1;
  y1;
  x2;
  y2;
  name;
  params;
  width;
  height;
  opened;

  constructor(x1, y1, width, height, name, params) {
    super();

    this.x1 = x1;
    this.y1 = y1;
    this.width = width;
    this.height = height;
    this.name = name;
    this.params = params;
    this.x2 = this.x1 + width;
    this.y2 = this.y1 + height;
    this.opened = false;
  }

  get pivot() {
    return { x: (this.x2 - this.x1) / 2, y: (this.y2 - this.y1) / 2 };
  }

  toggle() {
    this.opened = !this.opened;
  }

  render() {

  }
}

class Gui extends EventEmitter {
  saved = false;
  hoveringPath;

  ctx;
  #pages = {
    DEFAULT: "DEFAULT",
    SETTINGS: "SETTINGS",
    GAME: "GAME",
  };
  currentPage;

  #items = {
    DEFAULT: []
  }

  #paths = {
    DEFAULT: [],
    SETTINGS: [],
    GAME: [],
  }

  constructor(ctx) {
    super();

    this.ctx = ctx;
    this.currentPage = this.#pages.DEFAULT;
    const { width, height } = this.ctx.canvas;
    this.width = width;
    this.height = height;
    this.getDefaultItems();
    this.currentPage = this.#pages.DEFAULT
  }

  getDefaultItems() {
    const middleX = this.width / 2;
    this.#items[this.#pages.DEFAULT] = [
      { name: "Start", x1: middleX - 100, y1: 300, width: 200, height: 40 },
      { name: "Restart", x1: middleX - 100, y1: 350, width: 200, height: 40 },
      { name: "Settings", x1: middleX - 100, y1: 400, width: 200, height: 40 },
    ]
  }

  setContextForPage(page) {
    switch (page) {
      case this.#pages.DEFAULT:
        // this.ctx.strokeWidth = 10;
        this.ctx.strokeStyle = "#ffffff90";
        this.ctx.textBaseline = "middle";
        this.ctx.font = "20px serif";
        break;
      default:
        break;
    }
  }

  drawItem(element, oldPath = null) {
    const path = oldPath ?? new Path2D();
    this.ctx.fillStyle = "#00000080";
    path.roundRect(element.x1, element.y1, element.width, element.height, 20);
    const text = this.ctx.measureText(element.name);
    const x1 = element.x1 + element.width / 2 - text.width / 2;
    const y1 = element.y1 + element.height / 2;
    this.ctx.stroke(path);
    this.ctx.fill(path);
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(element.name, x1, y1);
    this.ctx.fill();
    return path;
  }

  drawDefault() {
    this.setContextForPage(this.#pages.DEFAULT);
    this.#items[this.#pages.DEFAULT].forEach((element) => {
      const path = this.drawItem(element);
      this.#paths.DEFAULT.push(path);
    });
  }

  drawSettings() {

  }

  drawGame() {

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
    const canvas = this.ctx.canvas;
    canvas.addEventListener("mousemove", (event) => {
      const {offsetX, offsetY} = event;
      const hoveringPath = this.#paths[this.currentPage].find((path) => this.ctx.isPointInPath(path, offsetX, offsetY));

      if (!hoveringPath) {
        canvas.classList.remove('hovering');
        if (!this.saved) return;

        this.saved = false;
        this.ctx.restore();


        const itemIndex = this.#paths[this.currentPage].findIndex((path) => path === this.hoveringPath);
        const item = this.#items[this.currentPage][itemIndex];
        this.ctx.clearRect(item.x1, item.y1, item.width, item.height);
        // this.drawBackdrop({x1: item.x1, y1: item.y1, width: item.width, height: item.height});
        // this.setContextForPage(this.#pages.DEFAULT);
        // this.drawItem(this.#items[this.currentPage][itemIndex], this.hoveringPath);
        this.hoveringPath = null;
        return;
      }

      if (this.saved) return;
      this.hoveringPath = hoveringPath;

      canvas.classList.add('hovering');
      this.ctx.save();
      this.saved = true;

      this.ctx.fillStyle = '#ffffff10';
      this.ctx.strokeStyle = '00000030';
      this.ctx.fill(this.hoveringPath);
      this.ctx.stroke(this.hoveringPath);
    })
  }
}
