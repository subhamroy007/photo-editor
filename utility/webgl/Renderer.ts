import { ExpoWebGLRenderingContext } from "expo-gl";
import Node3D from "./Node";
import { ProspectiveCamera } from "./ProspectiveCamera";

export interface RendererParams {
  viewport: [number, number, number, number];
  isCullFaceEnabled: boolean;
  clearColor: [number, number, number, number];
  clearDepth: number;
  enableDepthTest: boolean;
  depthFunc: number;
}

export class Renderer {
  gl: ExpoWebGLRenderingContext;
  params: RendererParams;
  constructor(
    gl: ExpoWebGLRenderingContext,
    params: RendererParams = {
      clearColor: [0.4, 0.8, 0.6, 1],
      clearDepth: 1.0,
      depthFunc: gl.LEQUAL,
      enableDepthTest: true,
      isCullFaceEnabled: false,
      viewport: [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight],
    }
  ) {
    this.gl = gl;
    this.params = params;
  }

  async render(camera: ProspectiveCamera, scene: Node3D) {
    this.gl.viewport(...this.params.viewport);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    camera.updateMatrix();
    await scene.update(false, camera, this.gl);

    this.gl.flush();
    this.gl.endFrameEXP();
  }
}
