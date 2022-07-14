import { TransformControls } from "./Utils/TransformControls";
import Experience from "./Experience";
import gsap from "gsap";
import * as THREE from "three";

export default class RotationControls {
  constructor(mesh, fadeItems) {
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
    this.fadeItems = fadeItems || []
    this.scene.add(this.controls);

    window.addEventListener("resetRotation", () => this.resetRotation());
    window.addEventListener("dragStart", () => this.startRotation());
  }

  startRotation() {
    this.static = false
    console.log(this.fadeItems)
    for (let i = 0; i < this.fadeItems.length; i++) {
      console.log(this.fadeItems[i])
      this.fadeItems[i].visible = false
      gsap.timeline().to(this.fadeItems[i].children[0].material, { duration: 0.5, opacity: 0 });
    }
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
          for (let i = 0; i < this.fadeItems.length; i++) {
            // this.fadeItems[i].visible = true
            // gsap.timeline().to(this.fadeItems[i].children[0].material, { duration: 0.5, opacity: 1 });
          }
        },
      })
      .to(this.mesh.rotation, { duration: 1, x: 0, y: 0, z: 0 });
  }
}
