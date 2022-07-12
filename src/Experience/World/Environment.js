import * as THREE from "three";
import Experience from "../Experience.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setMainLight();
    //this.setBackLight()
    this.setEnvironmentMap();
  }

  setMainLight() {
    this.mainLight = new THREE.DirectionalLight("#ffffff", 4);
    this.mainLight.castShadow = true;
    this.mainLight.shadow.camera.far = 15;
    this.mainLight.shadow.mapSize.set(1024, 1024);
    this.mainLight.shadow.normalBias = 0.05;
    this.mainLight.position.set(-3, 2, -1.25);
    this.scene.add(this.mainLight);

    if (this.debug.active) {
      this.debugFolder
        .add(this.mainLight, "intensity")
        .name("mainLightIntensity")
        .min(0)
        .max(100)
        .step(0.001);

      this.debugFolder
        .add(this.mainLight.position, "x")
        .name("mainLightX")
        .min(-20)
        .max(20)
        .step(0.001);

      this.debugFolder
        .add(this.mainLight.position, "y")
        .name("mainLightY")
        .min(-20)
        .max(20)
        .step(0.001);

      this.debugFolder
        .add(this.mainLight.position, "z")
        .name("mainLightZ")
        .min(-20)
        .max(20)
        .step(0.001);
    }
  }

  setBackLight() {
    this.backLight = new THREE.DirectionalLight("#ffffff", 4);
    this.backLight.castShadow = true;
    this.backLight.shadow.camera.far = 15;
    this.backLight.shadow.mapSize.set(1024, 1024);
    this.backLight.shadow.normalBias = 0.05;
    this.backLight.position.set(3.5, 2, -10);
    this.backLight.rotation.set(0, Math.PI/2, 0)
    this.scene.add(this.backLight);

    if (this.debug.active) {
      this.debugFolder
        .add(this.backLight, "intensity")
        .name("backLightIntensity")
        .min(0)
        .max(100)
        .step(0.001);

      this.debugFolder
        .add(this.backLight.position, "x")
        .name("backLightX")
        .min(-20)
        .max(20)
        .step(0.001);

      this.debugFolder
        .add(this.backLight.position, "y")
        .name("backLightY")
        .min(-20)
        .max(20)
        .step(0.001);

      this.debugFolder
        .add(this.backLight.position, "z")
        .name("backLightZ")
        .min(-20)
        .max(20)
        .step(0.001);
    }
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.sRGBEncoding;

    this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(10)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials);
    }
  }
}
