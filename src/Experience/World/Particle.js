import * as THREE from "three";
import Experience from "../Experience.js";

export default class Particle {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.model = null;
    this.kras = null;
    this.molecules = [];
    this.labels = [];
    this.internals = []
    this.heroMolecule = new THREE.Object3D()

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("particle");
    }

    this.resource = this.resources.items.particleModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    console.log(this.model);
    this.model.children.forEach((child) => {
      if (child.name === "Scene") {
        child.children.forEach((item) => {
          if (item.name === "KRAS") {
            this.kras = item;
          } else if (item.name.includes("molecule") || item.name.includes("low_poly")) {
            this.molecules.push(item);
          } else if (item.name.includes("CYS") || item.name.includes('inhibitor')) {
            this.internals.push(item)
          }
        });
      } else if (child.name.includes("Label")) {
        this.labels.push(child);
      }
    });
    this.heroMolecule.add(this.kras)
    this.labels.forEach(label => this.heroMolecule.add(label))
    this.internals.forEach(internal => this.heroMolecule.add(internal))
    this.scene.add(this.model);
    this.heroMolecule.scale.set(0.01, 0.01, 0.01)
    this.scene.add(this.heroMolecule)

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  update(still) {
    if (this.heroMolecule && still) {
      const time = this.time.clock.getElapsedTime();
      this.heroMolecule.position.y = Math.sin(time) * 0.1;
      this.heroMolecule.rotation.y = Math.sin(time / 2) * 0.1;
    }
    if (this.molecules) {
      const time = this.time.passiveClock.getElapsedTime();
      this.molecules.forEach(molecule => {
        molecule.position.y = Math.sin(time) * 50;
        molecule.rotation.y = Math.sin(time) * 0.5;
      })
    }
  }
}
