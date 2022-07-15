import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.container = document.querySelector('#app-container');
    // Setup
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight * 0.85
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Resize event
    window.addEventListener("resize", () => {
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight * 0.85
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);

      this.trigger("resize");
    });
  }
}
