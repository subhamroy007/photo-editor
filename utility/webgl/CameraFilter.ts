import { Camera } from "expo-camera";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { mat4 } from "gl-matrix";
import { View } from "react-native";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../constants";
import Core from "./Core";
import FrameGeometry from "./FrameGeometry";
import Node3D from "./Node";
import { ProspectiveCamera } from "./ProspectiveCamera";

export default class CameraFilterNode extends Node3D {
  frame: FrameGeometry;
  filterOptions: {
    vsSource: string;
    fsSource: string;
  } | null = null;
  target: Camera;
  canvas: GLView;
  attributeLocationList: number[] = [];
  uniformLocationList: (WebGLUniformLocation | null)[] = [];
  attributeBufferList: WebGLBuffer[] = [];
  indexBuffer: WebGLBuffer | null = null;
  program: WebGLProgram | null = null;
  targetTexture: WebGLTexture | null = null;
  inputsOptions: {
    tap?: [number, number, number];
    drag?: [number, number];
    selection?: number;
    bar?: number;
  } = {};
  requireCompilation: boolean = false;

  constructor(target: Camera, canvas: GLView) {
    super();
    this.frame = new FrameGeometry(WINDOW_WIDTH, WINDOW_HEIGHT);
    this.target = target;
    this.canvas = canvas;
  }

  setInputs(
    tap: [number, number, number],
    drag: [number, number],
    selection: number,
    bar: number
  ) {
    this.inputsOptions = { bar, drag, selection, tap };
  }

  setFilter(vsSource: string, fsSource: string) {
    this.filterOptions = { fsSource, vsSource };
    this.requireCompilation = true;
  }

  setProgram(gl: ExpoWebGLRenderingContext) {
    if (this.filterOptions) {
      this.program = Core.createProgram(
        gl,
        this.filterOptions.fsSource,
        this.filterOptions.vsSource
      );
    }
  }

  setBuffer(gl: ExpoWebGLRenderingContext) {
    this.frame.attributes.forEach((attribute) => {
      this.attributeBufferList.push(
        Core.createAndPopulateBuffer(
          gl,
          gl.ARRAY_BUFFER,
          attribute.array,
          attribute.type,
          attribute.usage
        )
      );
    });
    if (this.frame.index) {
      this.indexBuffer = Core.createAndPopulateBuffer(
        gl,
        gl.ELEMENT_ARRAY_BUFFER,
        this.frame.index.array,
        this.frame.index.type,
        this.frame.index.usage
      );
    }
  }

  setLocations(gl: ExpoWebGLRenderingContext) {
    this.attributeBufferList = [];
    this.uniformLocationList = [];
    if (this.program) {
      this.frame.attributes
        .map((attribute) => attribute.name)
        .forEach((name) => {
          this.attributeLocationList.push(
            Core.findAttributeLocation(gl, this.program!, name)
          );
        });
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_projectionMatrix")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_viewMatrix")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_worldMatrix")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_barInput")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_selectionInput")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_tapInput")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_dragInput")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_targetTexture")
      );
      this.uniformLocationList.push(
        Core.findUniformLocations(gl, this.program, "u_targetSize")
      );
    }
  }

  async setCameraTexture() {
    this.targetTexture = await this.canvas.createCameraTextureAsync(
      this.target
    );
  }
  async render(gl: ExpoWebGLRenderingContext, camera: ProspectiveCamera) {
    if (this.attributeBufferList.length === 0) {
      this.setBuffer(gl);
    }
    if (!this.targetTexture) {
      await this.setCameraTexture();
    }
    if (this.requireCompilation) {
      this.setProgram(gl);
      this.setLocations(gl);
      this.requireCompilation = false;
    }

    //use the program assigned to this filter
    gl.useProgram(this.program);

    //enable and attach every attributes with its corresponding buffer
    this.frame.attributes.forEach((attribute, index) => {
      const buffer = this.attributeBufferList[index];
      const location = this.attributeLocationList[index];
      const noOfComponents = attribute.noOfComponents;
      const normalize = attribute.normalize;
      const type = Core.getDataType(gl, attribute.type);
      Core.enableAndAttachBuffer(
        gl,
        location,
        buffer,
        noOfComponents,
        gl.ARRAY_BUFFER,
        normalize,
        type,
        0,
        0
      );
    });
    //set the projection matrix uniform
    gl.uniformMatrix4fv(
      this.uniformLocationList[0],
      false,
      camera.projectionMatrix
    );
    //set the view matrix uniform
    gl.uniformMatrix4fv(this.uniformLocationList[1], false, camera.viewMatrix);
    //set the world matrix uniform
    gl.uniformMatrix4fv(this.uniformLocationList[2], false, this.worldMatrix);
    //set the bar input uniform if necessery
    if (this.inputsOptions.bar) {
      gl.uniform1f(this.uniformLocationList[3], this.inputsOptions.bar);
    }
    //set the selection input uniform if necessery
    if (this.inputsOptions.selection) {
      gl.uniform1f(this.uniformLocationList[4], this.inputsOptions.selection);
    }
    //set the tap input uniform if necessery
    if (this.inputsOptions.tap) {
      gl.uniform3f(this.uniformLocationList[5], ...this.inputsOptions.tap);
    }
    //set the drag input uniform if necessery
    if (this.inputsOptions.drag) {
      gl.uniform2f(this.uniformLocationList[6], ...this.inputsOptions.drag);
    }

    //set the camera texture size
    gl.uniform2f(this.uniformLocationList[8], WINDOW_WIDTH, WINDOW_HEIGHT);

    //set the target camera texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
    gl.uniform1i(this.uniformLocationList[7], 0);

    //draw the triangles
    if (this.frame.range && this.frame.index) {
      const type = Core.getDataType(gl, this.frame.index.type);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.drawElements(
        gl.TRIANGLES,
        this.frame.range.count,
        type,
        this.frame.range.start
      );
    }
  }
}
