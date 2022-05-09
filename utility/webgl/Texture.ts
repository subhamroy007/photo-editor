import { Asset } from "expo-asset";
import { ExpoWebGLRenderingContext } from "expo-gl";
import { RNFFmpeg, RNFFmpegConfig, RNFFprobe } from "react-native-ffmpeg";
import CameraTexture from "./CameraTexture";
import ImageTexture from "./ImageTexture";
import VideoTexture from "./VideoTexture";
import * as FileSystem from "expo-file-system";

export type TextureWrapType = "REPEAT" | "CLAMP_TO_EDGE" | "MIRROR";
export type TextureMagFilter = "LINEAR" | "NEAREST";
export type TextureMinFilter =
  | "NEAREST_MIPMAP_NEAREST"
  | "LINEAR_MIPMAP_NEAREST"
  | "NEAREST_MIPMAP_LINEAR"
  | "LINEAR_MIPMAP_LINEAR"
  | TextureMagFilter;

export function getTextureIndex(gl: ExpoWebGLRenderingContext, index: number) {
  switch (index) {
    case 0:
      return gl.TEXTURE0;
    case 1:
      return gl.TEXTURE1;
    case 2:
      return gl.TEXTURE2;
    case 3:
      return gl.TEXTURE3;
    case 4:
      return gl.TEXTURE4;
    case 5:
      return gl.TEXTURE5;
    case 6:
      return gl.TEXTURE6;
    case 7:
      return gl.TEXTURE7;
    case 8:
      return gl.TEXTURE8;
    case 9:
      return gl.TEXTURE9;
    case 10:
      return gl.TEXTURE10;
    case 11:
      return gl.TEXTURE11;
    default:
      return gl.TEXTURE12;
  }
}

export function getTextureWrap(
  gl: ExpoWebGLRenderingContext,
  wrap: TextureWrapType
) {
  switch (wrap) {
    case "CLAMP_TO_EDGE":
      return gl.CLAMP_TO_EDGE;
    case "MIRROR":
      return gl.MIRRORED_REPEAT;
    case "REPEAT":
      return gl.REPEAT;
  }
}

export function getTextureMinMagFilter(
  gl: ExpoWebGLRenderingContext,
  filter: TextureMinFilter
) {
  switch (filter) {
    case "LINEAR":
      return gl.LINEAR;
    case "LINEAR_MIPMAP_LINEAR":
      return gl.LINEAR_MIPMAP_LINEAR;
    case "LINEAR_MIPMAP_NEAREST":
      return gl.LINEAR_MIPMAP_NEAREST;
    case "NEAREST":
      return gl.NEAREST;
    case "NEAREST_MIPMAP_LINEAR":
      return gl.NEAREST_MIPMAP_LINEAR;
    case "NEAREST_MIPMAP_NEAREST":
      return gl.NEAREST_MIPMAP_NEAREST;
  }
}

export function isImageTexture(texture: Texture): texture is ImageTexture {
  return (
    (texture as ImageTexture).isImageTexture !== undefined &&
    (texture as ImageTexture).isImageTexture === true
  );
}

export function isCameraTexture(texture: Texture): texture is CameraTexture {
  return (
    (texture as CameraTexture).isCameraTexture !== undefined &&
    (texture as CameraTexture).isCameraTexture === true
  );
}

export function isVideoTexture(texture: Texture): texture is VideoTexture {
  return (
    (texture as VideoTexture).isVideoTexture !== undefined &&
    (texture as VideoTexture).isVideoTexture === true
  );
}

export default class Texture {
  static textureCount: number = 0;
  wrapS: TextureWrapType;
  wrapT: TextureWrapType;
  minFilter: TextureMinFilter;
  magFilter: TextureMagFilter;
  texture: WebGLTexture | null = null;
  index: number;
  isUpdateRequired: boolean = true;
  name: string;
  isTexture: boolean = true;

  constructor(
    name: string = "",
    wrapS: TextureWrapType = "REPEAT",
    wrapT: TextureWrapType = "REPEAT",
    minFilter: TextureMinFilter = "LINEAR",
    magFilter: TextureMagFilter = "LINEAR"
  ) {
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.index = Texture.textureCount;
    this.name = name === "" ? `texture${Texture.textureCount}` : name;
    Texture.textureCount += 1;
  }

  async getTexture(gl: ExpoWebGLRenderingContext) {
    if (this.isUpdateRequired) {
      if (isImageTexture(this)) {
        const asset = Asset.fromURI(this.uri);

        await asset.downloadAsync();
        gl.activeTexture(getTextureIndex(gl, this.index));
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_S,
          getTextureWrap(gl, this.wrapS)
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_WRAP_T,
          getTextureWrap(gl, this.wrapT)
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          getTextureMinMagFilter(gl, this.minFilter)
        );
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MAG_FILTER,
          getTextureMinMagFilter(gl, this.magFilter)
        );

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          asset as any
        );
      } else if (isCameraTexture(this)) {
        this.texture = await this.glView.createCameraTextureAsync(this.camera);
      } else if (isVideoTexture(this)) {
      }
      this.isUpdateRequired = false;
    }

    if (isVideoTexture(this)) {
      const currentFrame = Math.round(
        (this.noOfFrames * (this.renderLoopTimestamp % this.duration)) /
          this.duration
      );
      const asset = Asset.fromURI(this.dir + `frame-${currentFrame}.png`);
      await asset.downloadAsync();
      gl.activeTexture(getTextureIndex(gl, this.index));
      this.texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        getTextureWrap(gl, this.wrapS)
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        getTextureWrap(gl, this.wrapT)
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        getTextureMinMagFilter(gl, this.minFilter)
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        getTextureMinMagFilter(gl, this.magFilter)
      );

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        asset as any
      );
    }

    return this.texture;
  }
}
