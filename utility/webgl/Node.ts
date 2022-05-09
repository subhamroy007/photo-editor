import { ExpoWebGLRenderingContext } from "expo-gl";
import { mat4, quat, vec3 } from "gl-matrix";
import { TransitionProperty } from "../../constants/types";
import { evaluatePropertyValue } from "../../constants/utility";
import Core from "./Core";
import Geometry from "./Geometry";
import Material from "./Material";
import { ProspectiveCamera } from "./ProspectiveCamera";

export default class Node3D {
  static nodeCount: number = 0;
  matrix: mat4 = mat4.create();
  parent: Node3D | null = null;
  translateX: number = 0;
  translateY: number = 0;
  translateZ: number = 0;
  scaleX: number = 1;
  scaleY: number = 1;
  scaleZ: number = 1;
  rotationX: number = 0;
  rotationY: number = 0;
  rotationZ: number = 0;
  requiredMatrixUpdate: boolean = false;
  requiredWorldMatrixUpdate: boolean = false;
  worldMatrix: mat4 = mat4.create();
  children: Node3D[] = [];
  geometry: Geometry | null;
  material: Material | null;
  attributeLocations: {
    [key: string]: number | null;
  } | null = null;
  name: string;
  constructor(
    geometry: Geometry | null = null,
    material: Material | null = null,
    name: string | null = null
  ) {
    this.geometry = geometry;
    this.material = material;
    this.name = name ? name : `node-${Node3D.nodeCount}`;
    Node3D.nodeCount += 1;
  }

  setTranslationX(value: number) {
    if (value !== this.translateX) {
      this.translateX = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setTranslationY(value: number) {
    if (value !== this.translateY) {
      this.translateY = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setTranslationZ(value: number) {
    if (value !== this.translateZ) {
      this.translateZ = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setRotationX(value: number) {
    if (value !== this.rotationX) {
      this.rotationX = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setRotationY(value: number) {
    if (value !== this.rotationY) {
      this.rotationY = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setRotationZ(value: number) {
    if (value !== this.rotationZ) {
      this.rotationZ = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setScaleX(value: number) {
    if (value !== this.scaleX) {
      this.scaleX = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setScaleY(value: number) {
    if (value !== this.scaleY) {
      this.scaleY = value;
      this.requiredMatrixUpdate = true;
    }
  }

  setScaleZ(value: number) {
    if (value !== this.scaleZ) {
      this.scaleZ = value;
      this.requiredMatrixUpdate = true;
    }
  }

  removeAll() {
    this.children.forEach((child) => (child.parent = null));
    this.children = [];
  }

  updateMatrix() {
    if (this.requiredMatrixUpdate) {
      mat4.identity(this.matrix);
      mat4.translate(
        this.matrix,
        this.matrix,
        vec3.fromValues(this.translateX, this.translateY, this.translateZ)
      );

      mat4.rotateX(this.matrix, this.matrix, (this.rotationX * Math.PI) / 180);
      mat4.rotateY(this.matrix, this.matrix, (this.rotationY * Math.PI) / 180);
      mat4.rotateZ(this.matrix, this.matrix, (this.rotationZ * Math.PI) / 180);

      mat4.scale(
        this.matrix,
        this.matrix,
        vec3.fromValues(this.scaleX, this.scaleY, this.scaleZ)
      );
      this.requiredMatrixUpdate = false;
      this.requiredWorldMatrixUpdate = true;
    }
  }

  async update(
    force: boolean,
    camera: ProspectiveCamera,
    gl: ExpoWebGLRenderingContext
  ) {
    this.updateMatrix();

    if (force || this.requiredWorldMatrixUpdate) {
      if (this.parent) {
        mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.matrix);
      } else {
        mat4.copy(this.worldMatrix, this.matrix);
      }
      this.requiredWorldMatrixUpdate = false;
      force = true;
    }
    await this.render(gl, camera);

    for (let i = 0; i < this.children.length; i++) {
      await this.children[i].update(force, camera, gl);
    }
  }

  add(node: Node3D) {
    if (node === this) {
      throw new Error("cannot be a child of its self");
    }

    if (node.parent === this) {
      throw new Error("cannot add same node to same parent more then once");
    }

    if (node.parent !== null) {
      node.parent.remove(node);
    }
    node.parent = this;
    this.children.push(node);
  }

  remove(node: Node3D) {
    const index = this.children.indexOf(node);
    this.children[index].parent = null;
    if (index !== -1) {
      this.children = this.children.filter((_, childIndex) => {
        return childIndex !== index;
      });
    }
  }

  async render(gl: ExpoWebGLRenderingContext, camera: ProspectiveCamera) {
    if (this.geometry && this.material) {
      //get the buffers associalted with the attributes
      const buffers = this.geometry.getBuffer(gl);
      const program = await this.material.useMaterial(
        gl,
        camera.projectionMatrix,
        camera.viewMatrix,
        this.worldMatrix
      );

      //get the attribute locations if not available
      if (!this.attributeLocations && buffers && program) {
        this.attributeLocations = {};
        const attributeNames = Object.keys(buffers.attributes);
        attributeNames.forEach((attributeName) => {
          this.attributeLocations![attributeName] = Core.findAttributeLocation(
            gl,
            program,
            attributeName
          );
        });
      }

      //enable the attributes
      const attributeNames = Object.keys(buffers!.attributes);
      attributeNames.forEach((attributeName) => {
        const buffer = buffers!.attributes[attributeName];
        const location = this.attributeLocations![attributeName];
        const attribute = this.geometry!.attributes![attributeName];
        Core.enableAndAttachBuffer(
          gl,
          location!,
          buffer!,
          attribute!.noOfComponents,
          gl.ARRAY_BUFFER,
          attribute!.normalize,
          attribute!.type,
          0,
          0
        );
      });

      //draw the vertices
      const type = Core.getDataType(gl, this.geometry!.index!.type);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers!.index);
      gl.drawElements(
        gl.TRIANGLES,
        this.geometry!.range!.count,
        type,
        this.geometry!.range!.start
      );
    }
  }
}
