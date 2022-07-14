import * as THREE from "three";
import Experience from "../Experience.js";
import Raycaster from "../Raycaster.js";

export default class Number {
  constructor(pos, value) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.raycaster = new Raycaster();

    this.setGeometry();
    this.setMaterial(value);
    this.setMesh(pos, value);
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(12.5, 32);
  }

  setMaterial(value) {
    this.texture = this.resources.items[value];
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: this.texture,
      side: THREE.DoubleSide,
    });
  }

  setMesh(pos, value) {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.name = value
  }
}
