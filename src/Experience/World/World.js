import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Particle from "./Particle.js";
import Raycaster from "../Raycaster.js";
import RotationControls from "../RotationControls.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.environment = new Environment();
      this.particle = new Particle();
      this.raycaster = new Raycaster();
      this.particle.numbers.forEach(number => {
        this.raycaster.addObjectToTest(number)
      })
      this.rotationControls = new RotationControls(this.particle.heroMolecule, this.particle.labels)
    });
  }

  update() {
    if (this.raycaster) this.raycaster.getIntersections();
    if (this.particle) this.particle.update(this.rotationControls.static);
  }
}
