class Game extends EventEmitter {
  paused = true;
  score = 0;

  constructor() {
    super();
    this.on("pause", () => {
      this.paused = !this.paused;
    });
  }

  initListeners() {
    window.addEventListener('keydown', (event) => {
      if (['Escape', 'p'].includes(event.key)) {
        this.trigger('pause');
        console.log(this.paused);
      }
    })
  }

  init() {
    this.initListeners();
  }

  render(delta, ...stack) {
    if (this.paused) return;

    stack.forEach((element) => {
      if (!element.render) {
        console.error(`[${element.name}] No render method provided`);
        return;
      }

      element.render(delta);
    });
  }
}
