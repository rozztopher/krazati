import * as THREE from "three";
import Experience from "./Experience";
import Mouse from "./Mouse";
import Sizes from "./Utils/Sizes";

export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new Mouse();
    this.sizes = new Sizes();
    this.currentIntersect = null;
    this.group = [];

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });
  }

  addObjectToTest(obj) {
    this.group.push(obj);
  }

  getIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.group);

    if (intersects.length) {
      if (!this.currentIntersect) {
      }

      this.currentIntersect = intersects[0];
    } else {
      if (this.currentIntersect) {
      }

      this.currentIntersect = null;
    }
  }
}
