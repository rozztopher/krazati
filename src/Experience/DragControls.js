import * as THREE from "three";
import Experience from "./Experience";
import Mouse from "./Mouse";
import Sizes from "./Utils/Sizes";

export default class DragControls {
  constructor() {
    this.targetRotationX = 0.5;
    this.targetRotationOnMouseDownX = 0;
    this.targetRotationY = 0.2;
    this.targetRotationOnMouseDownY = 0;
    this.mouseX = 0;
    this.mouseXOnMouseDown = 0;
    this.mouseY = 0;
    this.mouseYOnMouseDown = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.slowingFactor = 0.25;
    this.draggableObject = null;
    this.isMouseDown = false;

    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("mouseup", this.onDocumentMouseUp, false);
    document.addEventListener("mouseout", this.onDocumentMouseOut, false);
  }

  setDraggableObject(obj) {
    this.draggableObject = obj;
  }

  onDocumentMouseDown(event) {
    event.preventDefault();
    this.isMouseDown = true;

    this.mouseXOnMouseDown = event.clientX - (window.innerWidth/2);
    this.targetRotationOnMouseDownX = this.targetRotationX;
    this.mouseYOnMouseDown = event.clientY - (window.innerHeight / 2);
    this.targetRotationOnMouseDownY = this.targetRotationY;
  }

  onDocumentMouseMove(event) {
    if (this.isMouseDown) {
      this.mouseX = event.clientX - (window.innerWidth/2);
      this.targetRotationX = (this.mouseX - this.mouseXOnMouseDown) * 0.00025;
      this.mouseY = event.clientY - (window.innerHeight/2);
      this.targetRotationY = (this.mouseY - this.mouseYOnMouseDown) * 0.00025;
    }
  }

  onDocumentMouseUp(event) {
    this.isMouseDown = false;
  }

  onDocumentMouseOut(event) {
    this.isMouseDown = false;
  }

  rotateAroundObjectAxis(object, axis, radians) {
    let rotationMatrix = new THREE.Matrix4();
    // console.log(object, axis, radians)
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotationMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  rotateAroundWorldAxis(object, axis, radians) {
    let rotationMatrix = new THREE.Matrix4();
    // console.log(object, axis, radians)
    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    rotationMatrix.multiply(object.matrix); // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
  }

  update() {
    if (this.draggableObject) {
      this.rotateAroundWorldAxis(
        this.draggableObject,
        new THREE.Vector3(0, 1, 0),
        this.targetRotationX
      );
      this.rotateAroundWorldAxis(
        this.draggableObject,
        new THREE.Vector3(1, 0, 0),
        this.targetRotationY
      );

      this.targetRotationY = this.targetRotationY * (1 - this.slowingFactor);
      this.targetRotationX = this.targetRotationX * (1 - this.slowingFactor);
    }
  }
}
