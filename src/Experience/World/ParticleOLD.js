import * as THREE from "three";
import Experience from "../Experience.js";
import Number from "./Number.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";

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
    this.transitioning = false;

    this.resource = this.resources.items.particleModel;
    this.reference = this.resources.items.reference

    this.setModel();
    this.setNumbers();
    this.normaliseHero();
    this.addReference();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("particle");
      this.setDebug();
    }

    window.addEventListener("insertcys", () => this.insertCYS());
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.01, 0.01, 0.01);
    this.model.rotation.set(0, 0, 0);
    this.model.children.forEach((child) => {
      if (child.name === "Scene") {
        child.children.forEach((item) => {
          if (item.name === "KRAS") {
            this.setKras(item);
          } else if (
            item.name.includes("molecule") ||
            item.name.includes("low_poly")
          ) {
            this.setMolecule(item);
          } else if (item.name.includes("CYS")) {
            this.setCys(item);
          } else if (item.name.includes("inhibitor")) {
            this.setInhibitor(item);
          }
        });
      } else if (child.name.includes("Label")) {
        this.labels.push(child);
      }
    });
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.castShadow = true;
    //   }
    // });
  }

  addReference() {
    this.ref = this.reference.scene;
    console.log(this.ref)
    this.ref.scale.set(0.01, 0.01, 0.01);
    this.model.children.forEach((child) => {
      if (child.name === "Scene") {
        child.children.forEach((item) => {
          if (item.name === "KRAS") {
            this.setKras(item);
          } else if (item.name.includes("CYS")) {
            this.setCys(item);
          } else if (item.name.includes("inhibitor")) {
            this.setInhibitor(item);
          }
        });
      } else if (child.name.includes("Label")) {
        this.labels.push(child);
      }
    });
    this.ref.position.set(-3, 0, 0)
    this.scene.add(this.ref)
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.castShadow = true;
    //   }
    // });
  }

  setKras(kras) {
    const hdrEquirect = new RGBELoader().load("images/studio.hdr", () => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    });
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      transmission: 0.4,
      metalness: 0.1,
      clearcoat: 0,
      envMapIntensity: 0.4,
      color: 0x781e8c,
      specularColor: 0x7c1e8c,
      envMap: hdrEquirect,
      thickness: 0,
    });
    kras.children[0].material = material;
    kras.rotation.set(0, 0, 0);
    const newObject = kras.clone();
    this.heroMolecule.add(newObject);
    this.kras = newObject;
    const tex = this.resources.loaders.textureLoader.load(
      "images/normal.jpeg",
      (t) => {
        material.clearcoatMap = t;
        material.normalMap = t;
      }
    );
  }

  setInhibitor(inhibitor) {
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      transmission: 0.4,
      metalness: 0.1,
      envMapIntensity: 0.4,
      color: 0x00ff00,
      specularColor: 0x00ff00,
    });
    inhibitor.children[0].material = material;
    const newObject = inhibitor.clone();
    this.heroMolecule.add(newObject);
    this.inhibitor = newObject;
  }

  setCys(cys) {
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.25,
      transmission: 0.4,
      metalness: 0.1,
      envMapIntensity: 0.4,
      color: 0xff0000,
      specularColor: 0xff0000,
    });
    cys.children[0].material = material;
    const newObject = cys.clone();
    this.heroMolecule.add(newObject);
    this.cys = newObject;
    this.cys.visible = false;
  }

  setMolecule(item) {
    const newObject = item.clone();
    this.molecules.push(newObject);
    this.scene.add(newObject);
  }

  setNumbers() {
    const number1 = new Number({ x: 0, y: 0, z: 0 }, "one").mesh;
    const number2 = new Number({ x: 0.525, y: 0.132, z: 0.1 }, "two").mesh;
    const number3 = new Number({ x: 0.574, y: -0.35, z: 0.1 }, "three").mesh;
    const number4 = new Number({ x: 0.9, y: -0.3, z: 0.1 }, "four").mesh;
    this.heroMolecule.add(number1);
    this.numbers.push(number1);
    this.heroMolecule.add(number2);
    this.numbers.push(number2);
    this.heroMolecule.add(number3);
    this.numbers.push(number3);
    this.heroMolecule.add(number4);
    this.numbers.push(number4);
  }

  update(still) {
    // if (!this.transitioning) {
    //   if (this.heroMolecule && still) {
    //     const time = this.time.clock.getElapsedTime();
    //     this.heroMolecule.position.y = Math.sin(time) * 0.1;
    //     this.heroMolecule.rotation.y = Math.sin(time / 2) * 0.1;
    //   }
    //   if (this.molecules) {
    //     const time = this.time.passiveClock.getElapsedTime();
    //     this.molecules.forEach((molecule) => {
    //       molecule.position.y = Math.sin(time) * 50;
    //       molecule.rotation.y = Math.sin(time) * 0.5;
    //     });
    //   }
    // }
    if (this.numbers) {
      for (let i = 0; i < this.numbers.length; i++) {
        this.numbers[i].lookAt(this.camera.position);
      }
    }
  }

  normaliseHero() {
    this.heroMolecule.scale.set(0.01, 0.01, 0.01);
    this.kras.transparent = true;
    this.kras.position.set(0, 0, 0);
    this.kras.rotation.set(0, 0.25, 0);
    this.cys.position.set(500, 0, 500);
    this.cys.rotation.set(Math.PI/2, 0, 0)
    this.numbers[0].position.set(-80, -15, 100);
    this.numbers[1].position.set(-15, 12, 100);
    this.numbers[2].position.set(-20, -35, 100);
    this.numbers[3].position.set(9, -30, 100);
    this.heroMolecule.rotation.set(0, 0, 0);
    this.scene.add(this.heroMolecule);
  }

  insertCYS() {
    this.transitioning = true;
    gsap
      .timeline({ onComplete: () => (this.cys.visible = true) })
      .to(this.heroMolecule.rotation, { duration: 2, y: -1 });
    gsap
      .timeline()
      .to(this.cys.position, { delay: 2, duration: 3, x: 0, z: 0 });
    setTimeout(() => (this.transitioning = false), 7000);
  }

  setDebug() {
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
      .add(this.heroMolecule.rotation, "x")
      .name("x (rotation)")
      .min(-4)
      .max(4)
      .step(0.001);
      this.debugFolder
      .add(this.heroMolecule.rotation, "y")
      .name("y (rotation)")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .add(this.heroMolecule.rotation, "z")
      .name("z (rotation)")
      .min(-4)
      .max(4)
      .step(0.001);
      this.debugFolder
      .add(this.heroMolecule.position, "x")
      .name("x (position)")
      .min(-4)
      .max(4)
      .step(0.001);
      this.debugFolder
      .add(this.heroMolecule.position, "y")
      .name("y (position)")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .add(this.heroMolecule.position, "z")
      .name("z (position)")
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
