import * as THREE from "three";
import Experience from "../Experience.js";
import Number from "./Number.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import gsap from "gsap";
import { normalPosition, inhibitorPosition } from "../Utils/Constants.js";

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
    this.numbers = [];
    this.heroMolecule = new THREE.Group();
    this.transitioning = false;

    this.reference = this.resources.items.reference

    // this.setNumbers();
    this.addReference();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("particle");
      this.setDebug();
    }

    window.addEventListener("insertcys", () => this.insertInhibitor());
  }

  addReference() {
    this.ref = this.reference.scene;
    this.ref.scale.set(0.0125, 0.0125, 0.0125);
    this.ref.children.forEach((child) => {
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
    this.heroMolecule.add(this.ref)
    this.heroMolecule.position.set(0,0.33,0)
    this.scene.add(this.heroMolecule)
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
    kras.position.x = kras.position.x + normalPosition.x
    kras.position.y = kras.position.y + normalPosition.y
    kras.position.z = kras.position.z + normalPosition.z
    this.kras = kras;
    this.resources.loaders.textureLoader.load(
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
    inhibitor.position.x = inhibitor.position.x + normalPosition.x
    inhibitor.position.y = inhibitor.position.y + normalPosition.y
    inhibitor.position.z = inhibitor.position.z + normalPosition.z
    // inhibitor.rotation.y = Math.PI/2
    console.log(inhibitor.position)
    inhibitor.children[0].material = material;
    this.inhibitor = inhibitor;
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
    cys.position.x = cys.position.x + normalPosition.x
    cys.position.y = cys.position.y + normalPosition.y
    cys.position.z = cys.position.z + normalPosition.z
    cys.children[0].material = material;
    this.cys = cys;
    this.cys.visible = false;
  }

  setNumbers() {
    const number1 = new Number({ x: -1.1, y: 0, z: 1.1 }, "one").mesh;
    const number2 = new Number({ x: 0, y: -0.6, z: 1.3 }, "two").mesh;
    const number3 = new Number({ x: 0.5, y: -0.5, z: 1.3 }, "three").mesh;
    const number4 = new Number({ x: 0.7, y: -0.1, z: 1.4 }, "four").mesh;
    this.numbers.push(number1);
    this.numbers.push(number2);
    this.numbers.push(number3);
    this.numbers.push(number4);
    this.numbers.forEach(number => this.heroMolecule.add(number))
  }

  update(still) {
    if (!this.transitioning) {
      if (this.heroMolecule && still) {
        const time = this.time.clock.getElapsedTime();
        this.heroMolecule.position.x = Math.sin(time) * 0.025;
        this.heroMolecule.position.y = (Math.sin(time) * 0.05) + 0.33;
        this.heroMolecule.rotation.y = Math.sin(time / 2) * 0.05;
      }
    }
    if (this.numbers) {
      for (let i = 0; i < this.numbers.length; i++) {
        this.numbers[i].lookAt(this.camera.position);
      }
    }
  }

  insertInhibitor() {
    this.transitioning = true;
    // gsap
    //   .timeline({ onComplete: () => (this.inhibitor.visible = true) })
    //   .to(this.heroMolecule.rotation, { duration: 2, y: 0 });
    gsap
      .timeline()
      .to(this.inhibitor.position, { delay: 2, duration: 3, z: inhibitorPosition.z });
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
      this.debugFolder
      .add(this.inhibitor.rotation, "x")
      .name("x (position)")
      .min(-4)
      .max(4)
      .step(0.001);
      this.debugFolder
      .add(this.inhibitor.rotation, "y")
      .name("y (position)")
      .min(-4)
      .max(4)
      .step(0.001);
    this.debugFolder
      .add(this.inhibitor.rotation, "z")
      .name("z (position)")
      .min(-4)
      .max(4)
      .step(0.001);
  }
}
