import { TransformControls } from "./Utils/TransformControls";
import Experience from "./Experience";
import gsap from "gsap";
import * as THREE from "three";

export default class RotationControls {
  constructor(mesh) {
    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.renderer = this.experience.renderer.instance;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resetting = false;
    this.static = true;
    this.controls = new TransformControls(
      this.camera,
      this.renderer.domElement
    );
    this.controls.setMode("rotate");
    this.controls.attach(mesh);
    this.mesh = mesh;
    this.scene.add(this.controls);

    window.addEventListener("resetRotation", () => this.resetRotation());
    window.addEventListener("dragStart", () => (this.static = false));
  }

  resetRotation() {
    this.resetting = true;
    gsap.timeline().to(this.mesh.position, { duration: 0.5, x: 0, y: 0, z: 0 });
    gsap
      .timeline({
        onComplete: () => {
          this.resetting = false;
          this.time.clock = new THREE.Clock();
          this.static = true
        },
      })
      .to(this.mesh.rotation, { duration: 1, x: 0, y: 0, z: 0 });
  }
}
