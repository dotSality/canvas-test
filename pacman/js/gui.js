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
  ctx;
  #pages = {
    DEFAULT: "default",
    SETTINGS: "settings",
    GAME: "game",
  };
  currentPage;

  constructor(ctx) {
    super();

    this.ctx = ctx;
    this.currentPage = this.#pages.DEFAULT;
    const { width, height } = this.ctx.canvas;
    this.width = width;
    this.height = height;
  }

  drawDefault() {
    this.ctx.strokeWidth = 10;
    this.ctx.strokeStyle = "#ffffff90";
    const middleX = this.width / 2;
    this.ctx.textBaseline = "middle";
    this.ctx.font = "20px serif";
    [
      { name: "Start", x1: middleX - 100, y1: 300, width: 200, height: 40 },
      { name: "Restart", x1: middleX - 100, y1: 350, width: 200, height: 40 },
      { name: "Settings", x1: middleX - 100, y1: 400, width: 200, height: 40 },
    ].forEach((element) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = "#00000080";
      this.ctx.roundRect(element.x1, element.y1, element.width, element.height, 20);
      const text = this.ctx.measureText(element.name);
      const x1 = element.x1 + element.width / 2 - text.width / 2;
      const y1 = element.y1 + element.height / 2;
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.fillStyle = "white";
      this.ctx.fillText(element.name, x1, y1);
      this.ctx.fill();
    });
  }

  drawSettings() {

  }

  drawGame() {

  }

  draw() {
    this.ctx.fillStyle = "#00000040";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}
