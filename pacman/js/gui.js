const Pages = {
  DEFAULT: "DEFAULT",
  SETTINGS: "SETTINGS",
  GAME: "GAME",
};
const SvgIcons = {
  ARROWS: "arrows",
};

const PADDING = 5;
const HEART_PATH = "M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z";

const ARROW_KEYS_SVG = `<svg viewBox="0 0 324 212" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="115" y="3" width="94" height="94" rx="13" stroke="white" stroke-width="6"/>
  <rect x="115" y="115" width="94" height="94" rx="13" stroke="white" stroke-width="6"/>
  <rect x="227" y="115" width="94" height="94" rx="13" stroke="white" stroke-width="6"/>
  <rect x="3" y="115" width="94" height="94" rx="13" stroke="white" stroke-width="6"/>
  <path d="M159 68C159 69.6569 160.343 71 162 71C163.657 71 165 69.6569 165 68L162 68L159 68ZM164.121 29.8787C162.95 28.7071 161.05 28.7071 159.879 29.8787L140.787 48.9706C139.615 50.1421 139.615 52.0416 140.787 53.2132C141.958 54.3848 143.858 54.3848 145.029 53.2132L162 36.2426L178.971 53.2132C180.142 54.3848 182.042 54.3848 183.213 53.2132C184.385 52.0416 184.385 50.1421 183.213 48.9706L164.121 29.8787ZM162 68L165 68L165 32L162 32L159 32L159 68L162 68Z" fill="white"/>
  <path d="M256 159C254.343 159 253 160.343 253 162C253 163.657 254.343 165 256 165V162V159ZM294.121 164.121C295.293 162.95 295.293 161.05 294.121 159.879L275.029 140.787C273.858 139.615 271.958 139.615 270.787 140.787C269.615 141.958 269.615 143.858 270.787 145.029L287.757 162L270.787 178.971C269.615 180.142 269.615 182.042 270.787 183.213C271.958 184.385 273.858 184.385 275.029 183.213L294.121 164.121ZM256 162V165H292V162V159H256V162Z" fill="white"/>
  <path d="M68 165C69.6569 165 71 163.657 71 162C71 160.343 69.6569 159 68 159L68 162L68 165ZM29.8787 159.879C28.7071 161.05 28.7071 162.95 29.8787 164.121L48.9706 183.213C50.1421 184.385 52.0416 184.385 53.2132 183.213C54.3848 182.042 54.3848 180.142 53.2132 178.971L36.2426 162L53.2132 145.029C54.3848 143.858 54.3848 141.958 53.2132 140.787C52.0416 139.615 50.1421 139.615 48.9706 140.787L29.8787 159.879ZM68 162L68 159L32 159L32 162L32 165L68 165L68 162Z" fill="white"/>
  <path d="M159 144C159 142.343 160.343 141 162 141C163.657 141 165 142.343 165 144L162 144L159 144ZM164.121 182.121C162.95 183.293 161.05 183.293 159.879 182.121L140.787 163.029C139.615 161.858 139.615 159.958 140.787 158.787C141.958 157.615 143.858 157.615 145.029 158.787L162 175.757L178.971 158.787C180.142 157.615 182.042 157.615 183.213 158.787C184.385 159.958 184.385 161.858 183.213 163.029L164.121 182.121ZM162 144L165 144L165 180L162 180L159 180L159 144L162 144Z" fill="white"/>
</svg>`;

class SvgCanvasImage {
  #blob;
  #defaultDimensions = { x: 0, y: 0 };

  constructor(innerText) {
    this.#blob = new Blob([innerText], { type: "image/svg+xml" });
  }

  draw(ctx, dimensions = this.#defaultDimensions) {
    const url = URL.createObjectURL(this.#blob);
    const args = Object.values(dimensions);
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, ...args);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }
}

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

  #icons = {};

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

    this.drawSettings();

    this.on("printScore", (value) => {
      this.drawGameScoreValue(value);
    });
  }

  drawSettings() {
    this.ctx.save();
    const x1 = 140;

    const icon = new SvgCanvasImage(ARROW_KEYS_SVG);
    this.#icons[SvgIcons.ARROWS] = icon;
    const aspect = 324 / 212;
    const iconHeight = 20;
    const iconWidth = iconHeight * aspect;
    const dimensions = { x: 140, y: PADDING, width: iconWidth, height: iconHeight };
    icon.draw(this.ctx, dimensions);
    this.ctx.fillStyle = "white";
    this.ctx.font = "14px serif";
    this.ctx.textBaseline = "top";
    this.ctx.fillText(" - moving, P - pause, Esc - menu", x1 + iconWidth, PADDING + 3);
    this.ctx.restore();
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
    this.ctx.fillRect(x1 - 1, y1, valueMeta.width + 2, 20);
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.fillText(scoreString, x1, y1);
    this.ctx.restore();

    this.unregisterEvents();
  }

  drawHotkeys() {

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

    this.on("start", () => {
      this.clearDefaultPage();
      this.drawGamePage();
    });
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
