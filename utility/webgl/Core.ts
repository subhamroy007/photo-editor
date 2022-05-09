import { ExpoWebGLRenderingContext } from "expo-gl";
import { AttributeType, AttributeUsage } from "./Attribute";

export default class Core {
  static createShader(
    gl: ExpoWebGLRenderingContext,
    type: number,
    source: string
  ) {
    const shader = gl.createShader(type);
    if (!shader) {
      throw new Error("error occured while creating shader");
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const isSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!isSuccess) {
      gl.deleteShader(shader);
      throw new Error("error occured while compiling shader");
    }

    return shader;
  }
  static createProgram(
    gl: ExpoWebGLRenderingContext,
    fsSource: string,
    vsSource: string
  ): WebGLProgram {
    const program = gl.createProgram();
    if (!program) {
      throw new Error("error occured while creating program");
    }
    gl.attachShader(program, this.createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(
      program,
      this.createShader(gl, gl.FRAGMENT_SHADER, fsSource)
    );
    gl.linkProgram(program);
    const isSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!isSuccess) {
      gl.deleteProgram(program);
      throw new Error("error occured while linking program");
    }

    return program;
  }
  static findAttributeLocation(
    gl: ExpoWebGLRenderingContext,
    program: WebGLProgram,
    name: string
  ) {
    const location = gl.getAttribLocation(program, "a_" + name);
    if (location < 0) {
      throw new Error("error occured while finding attribute location " + name);
    }
    return location;
  }
  static findUniformLocations(
    gl: ExpoWebGLRenderingContext,
    program: WebGLProgram,
    name: string
  ): WebGLUniformLocation | null {
    const location = gl.getUniformLocation(program, "u_" + name);

    return location;
  }
  static createAndPopulateBuffer(
    gl: ExpoWebGLRenderingContext,
    bindingPoint: number,
    array: number[],
    type: AttributeType,
    usage: AttributeUsage
  ) {
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error("failed to init buffer");
    }

    gl.bindBuffer(bindingPoint, buffer);

    const bufferUsage = this.getUsage(gl, usage);
    const bufferData = this.getData(gl, array, type);
    gl.bufferData(bindingPoint, bufferData, bufferUsage);
    return buffer;
  }
  static getUsage(gl: ExpoWebGLRenderingContext, usage: AttributeUsage) {
    switch (usage) {
      case "STATIC_DRAW":
        return gl.STATIC_DRAW;
      case "DYNAMIC_DRAW":
        return gl.DYNAMIC_DRAW;
      case "STREAM_DRAW":
        return gl.STREAM_DRAW;
    }
  }
  static getData(
    gl: ExpoWebGLRenderingContext,
    array: number[],
    type: AttributeType
  ) {
    switch (type) {
      case "BYTE":
        return new Int8Array(array);
      case "FLOAT":
        return new Float32Array(array);
      case "INT":
        return new Int32Array(array);
      case "SHORT":
        return new Int16Array(array);
      case "UBYTE":
        return new Uint8Array(array);
      case "UINT":
        return new Uint32Array(array);
      case "USHORT":
        return new Uint16Array(array);
    }
  }
  static getDataType(gl: ExpoWebGLRenderingContext, type: AttributeType) {
    switch (type) {
      case "BYTE":
        return gl.BYTE;
      case "FLOAT":
        return gl.FLOAT;
      case "INT":
        return gl.INT;
      case "SHORT":
        return gl.SHORT;
      case "UBYTE":
        return gl.UNSIGNED_BYTE;
      case "UINT":
        return gl.UNSIGNED_INT;
      case "USHORT":
        return gl.UNSIGNED_SHORT;
    }
  }
  static enableAndAttachBuffer(
    gl: ExpoWebGLRenderingContext,
    attributeLocation: number,
    attributeBuffer: WebGLBuffer,
    noOfComponents: number,
    bindingPoint: number,
    normalize: boolean,
    type: AttributeType,
    offset: number,
    stride: number
  ) {
    gl.enableVertexAttribArray(attributeLocation);
    gl.bindBuffer(bindingPoint, attributeBuffer);
    gl.vertexAttribPointer(
      attributeLocation,
      noOfComponents,
      this.getDataType(gl, type),
      normalize,
      stride,
      offset
    );
  }
  // static getDepthFunc(gl: ExpoWebGLRenderingContext, func: DepthFunc) {
  //   switch (func) {
  //     case "LEQUAL":
  //       return gl.LEQUAL;
  //   }
  // }
}
