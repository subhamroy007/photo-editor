import { mat4, vec3 } from "gl-matrix";
import Node3D from "./Node";

export class OrthograpicCamera extends Node3D {
  projectionMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();
  up: vec3 = vec3.fromValues(0, 1, 0);
  target: vec3 = vec3.create();
  constructor(
    top: number,
    bottom: number,
    front: number,
    back: number,
    left: number,
    right: number
  ) {
    super();
    mat4.ortho(this.projectionMatrix, left, right, bottom, top, front, back);
  }
  lookAt(target: vec3) {
    this.target = target;
  }
  setUp(up: vec3) {
    this.up = up;
  }
  updateMatrix(): void {
    super.updateMatrix();
    const eye = vec3.fromValues(
      this.matrix[12],
      this.matrix[13],
      this.matrix[14]
    );
    const zAxis = vec3.create();
    const xAxis = vec3.create();
    const yAxis = vec3.create();
    vec3.normalize(zAxis, vec3.subtract(zAxis, eye, this.target));
    vec3.normalize(xAxis, vec3.cross(xAxis, this.up, zAxis));
    vec3.normalize(yAxis, vec3.cross(yAxis, zAxis, xAxis));

    this.matrix = mat4.fromValues(
      xAxis[0],
      xAxis[1],
      xAxis[2],
      0,
      yAxis[0],
      yAxis[1],
      yAxis[2],
      0,
      zAxis[0],
      zAxis[1],
      zAxis[2],
      0,
      eye[0],
      eye[1],
      eye[2],
      1
    );
    // mat4.lookAt(this.matrix, eye, this.target, this.up);
    mat4.invert(this.viewMatrix, this.matrix);
  }
}
