import * as dat from "lil-gui";

export default class Debug {
  constructor() {
    // this.active = window.location.hash === "#debug";
    this.active = false

    if (this.active) {
      this.ui = new dat.GUI();
    }
  }
}
