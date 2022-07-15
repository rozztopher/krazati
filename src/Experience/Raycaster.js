import * as THREE from "three";
import Experience from "./Experience";
import Mouse from "./Mouse";
import Sizes from "./Utils/Sizes";
import AnimationControls from "./domControls/AnimationControls";
import TimelineControls from "./domControls/TimelineControls";
import World from "./World/World";

export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new Mouse();
    this.sizes = new Sizes();
    this.animationControls = new AnimationControls()
    this.timelineControls = new TimelineControls()
    this.currentIntersect = null;
    this.group = [];

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });

    window.addEventListener("click", () => {this.triggerEvent()});
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

      this.currentIntersect = intersects[0].object;
    } else {
      if (this.currentIntersect) {
      }

      this.currentIntersect = null;
    }
  }

  triggerEvent() {
    if (this.currentIntersect) {
      const number = this.currentIntersect.name
      if (number === "one") {
        this.timelineControls.transitionSection(0)
        const event = new Event('insertcys');
        window.dispatchEvent(event)
      } else if (number === "two") {
        this.timelineControls.transitionSection(1)
      } else if (number === "three") {
        this.timelineControls.transitionSection(2)
      } else if (number === "four") {
        this.timelineControls.transitionSection(3)
      }
    }
  }
}
