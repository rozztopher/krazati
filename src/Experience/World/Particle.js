import * as THREE from "three";
import Experience from "../Experience.js";
import Number from "./Number.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

export default class Particle {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.debug = this.experience.debug;
    this.model = null;
    this.kras = null;
    this.molecules = [];
    this.labels = [];
    this.internals = [];
    this.numbers = [];
    this.heroMolecule = new THREE.Group();

    this.resource = this.resources.items.particleModel;

    this.setModel();
    this.setNumbers();
    this.formHero();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("particle");
      this.setDebug();
    }
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.children.forEach((child) => {
      if (child.name === "Scene") {
        child.children.forEach((item) => {
          if (item.name === "KRAS") {
            this.setKras(item)
          } else if (
            item.name.includes("molecule") ||
            item.name.includes("low_poly")
          ) {
            this.molecules.push(item);
          } else if (
            item.name.includes("CYS") ||
            item.name.includes("inhibitor")
          ) {
            this.internals.push(item);
          }
        });
      } else if (child.name.includes("Label")) {
        this.labels.push(child);
      }
    });
    this.model.position.x = -0.75;
    this.scene.add(this.model);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setKras(kras) {
    console.log(kras);
    const hdrEquirect = new RGBELoader().load(
      "images/studio.hdr",
      () => {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
      }
    );
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      transmission: 0.4,
      metalness: 0.1,
      clearcoat: 0,
      envMapIntensity: 0.4,
      color: 0x781e8c,
      specularColor: 0x7c1e8c,
      envMap: hdrEquirect,
      thickness: 0
    });
    kras.children[0].material = material;
    this.heroMolecule.add(kras);
    const tex = this.resources.loaders.textureLoader.load(
      "images/normal.jpeg",
      (t) => {
        material.clearcoatMap = t
        material.normalMap = t
      }
    );
  }

  setNumbers() {
    const number1 = new Number({ x: 0, y: 0, z: 0 }, "one").mesh;
    const number2 = new Number({ x: 0.525, y: 0.132, z: 0.1 }, "two").mesh;
    const number3 = new Number({ x: 0.574, y: -0.35, z: 0.1 }, "three").mesh;
    const number4 = new Number({ x: 0.9, y: -0.3, z: 0.1 }, "four").mesh;
    this.heroMolecule.add(number1);
    this.heroMolecule.add(number2);
    this.heroMolecule.add(number3);
    this.heroMolecule.add(number4);
  }

  update(still) {
    if (this.heroMolecule && still) {
      const time = this.time.clock.getElapsedTime();
      this.heroMolecule.position.y = Math.sin(time) * 0.1;
      this.heroMolecule.rotation.y = Math.sin(time / 2) * 0.1;
    }
    if (this.molecules) {
      const time = this.time.passiveClock.getElapsedTime();
      this.molecules.forEach((molecule) => {
        molecule.position.y = Math.sin(time) * 50;
        molecule.rotation.y = Math.sin(time) * 0.5;
      });
    }
    if (this.numbers) {
      for (let i = 0; i < this.numbers.length; i++) {
        this.numbers[i].lookAt(this.camera.position);
      }
    }
  }

  formHero() {
    this.heroMolecule.scale.set(0.01, 0.01, 0.01);
    this.heroMolecule.children[0].position.set(0, 0, 0);
    this.heroMolecule.children[0].rotation.set(0, 0, 0);
    this.heroMolecule.children[1].position.set(-80, -15, 100);
    this.heroMolecule.children[2].position.set(-15, 12, 100);
    this.heroMolecule.children[3].position.set(-20, -35, 100);
    this.heroMolecule.children[4].position.set(9, -30, 100);
    this.kras = this.heroMolecule.children[0];
    this.numbers.push(this.heroMolecule.children[1]);
    this.numbers.push(this.heroMolecule.children[2]);
    this.numbers.push(this.heroMolecule.children[3]);
    this.numbers.push(this.heroMolecule.children[4]);
    this.scene.add(this.heroMolecule);
  }

  setDebug() {
    console.log(this.kras.children[0]);
    this.debugFolder
      .add(this.kras.children[0].material, "transmission")
      .name("transmission")
      .min(0)
      .max(1)
      .step(0.001);
    this.debugFolder
      .add(this.kras.children[0].material, "roughness")
      .name("roughness")
      .min(0)
      .max(1)
      .step(0.001);
    this.debugFolder
      .add(this.kras.children[0].material, "envMapIntensity")
      .name("envMapIntensity")
      .min(0)
      .max(1)
      .step(0.001);
    this.debugFolder
      .add(this.kras.children[0].material, "metalness")
      .name("metalness")
      .min(0)
      .max(1)
      .step(0.001);
    this.debugFolder
      .add(this.kras.children[0].material, "clearcoat")
      .name("clearcoat")
      .min(0)
      .max(1)
      .step(0.001);
      this.debugFolder
      .add(this.kras.children[0].material, "thickness")
      .name("thickness")
      .min(0)
      .max(5)
      .step(0.001);
    this.debugFolder
      .add(this.heroMolecule.children[0].rotation, "x")
      .name("x")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .add(this.heroMolecule.children[0].rotation, "y")
      .name("y")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .add(this.heroMolecule.children[0].rotation, "z")
      .name("z")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .addColor(this.kras.children[0].material, "color")
      .name("colour");
    this.debugFolder
      .addColor(this.kras.children[0].material, "specularColor")
      .name("colour");
  }
}
