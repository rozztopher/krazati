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
    this.raycaster = new Raycaster()

    this.resources.on("ready", () => {
      this.environment = new Environment();
      this.particle = new Particle();
      console.log(this.particle.heroMolecule)
      this.raycaster.addObjectToTest(this.particle.kras)
      this.rotationControls = new RotationControls(this.particle.heroMolecule)
    });
  }

  update() {
    if (this.raycaster) this.raycaster.getIntersections();
    if (this.particle) this.particle.update(this.rotationControls.static);
  }
}
