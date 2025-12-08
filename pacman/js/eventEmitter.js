const logMethod = (method, message, type = "log") => {
  console[type](`[${method.name}]: ${message}`);
};

class EventEmitter {
  #events;

  constructor() {
    this.#events = new Map();
  }

  on(eventName, callback) {
    if (!eventName || !callback) {
      logMethod(this.on, "invalid parameters", "error");
    }

    const current = this.#events.get(eventName);
    const events = current ? [...current, callback] : [callback];
    this.#events.set(eventName, events);
  }

  off(eventName, removingCallback) {
    const current = this.#events.get(eventName);
    if (!removingCallback) {
      logMethod(this.off, `no callback provided for: ${eventName}`, "error");
    }
    const events = current ? current.filter((callback) => callback !== removingCallback) : [];
    this.#events.set(eventName, events);
  }

  trigger(name, ...args) {
    if (!name) {
      logMethod(this.trigger, "invalid event name", "error");
    }
    const callbacks = this.#events.get(name);
    if (!callbacks) {
      logMethod(this.trigger, `no callbacks for event: ${name}`, "error");
    }

    return callbacks.forEach((callback) => callback.apply(null, args));
  }
}
