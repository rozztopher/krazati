import * as THREE from "three";
import Experience from "../Experience.js";

export default class Background {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(48, 24)
  }

  setTexture() {
    this.texture = this.resources.items.background;
    this.texture.encoding = THREE.sRGBEncoding;
    // this.texture.repeat.set(1.5, 1.5);
    // this.texture.wrapS = THREE.RepeatWrapping;
    // this.texture.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, -30);
    this.scene.add(this.mesh);
  }
}
