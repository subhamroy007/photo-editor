import { Camera } from "expo-camera";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import Texture from "./Texture";

export default class CameraTexture extends Texture {
  camera: Camera;
  glView: GLView;
  isCameraTexture: boolean = true;
  constructor(camera: Camera, glView: GLView, name: string) {
    super(name);
    this.camera = camera;
    this.glView = glView;
  }
}
