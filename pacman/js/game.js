class Game extends EventEmitter {
  paused = false;

  constructor() {
    super();
    this.on("pause", () => {
      this.paused = !this.paused;
    });
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
