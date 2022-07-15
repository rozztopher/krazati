import Timeline from "../Utils/Timeline.js";
import Experience from "../Experience.js";
import gsap from "gsap";

export default class AnimationControls {
  constructor() {
    this.experience = new Experience();
    this.world = this.experience.world
    // this.hero = this.world.particle
    // this.cys = this.hero.cys
  }

  insertCYS() {
    // gsap.timeline().to(this.cys.position, {duration: 1, x: 0})
  }
}
