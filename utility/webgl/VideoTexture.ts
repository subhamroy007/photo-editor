import Texture, {
  TextureMagFilter,
  TextureMinFilter,
  TextureWrapType,
} from "./Texture";

export default class VideoTexture extends Texture {
  dir: string;
  width: number;
  height: number;
  duration: number;
  noOfFrames: number;
  isVideoTexture: boolean = true;
  renderLoopTimestamp: number = 0;
  constructor(
    dir: string,
    width: number,
    height: number,
    duration: number,
    frames: number,
    wrapS?: TextureWrapType,
    wrapT?: TextureWrapType,
    minFilter?: TextureMinFilter,
    magFilter?: TextureMagFilter,
    name?: string
  ) {
    super(name, wrapS, wrapT, minFilter, magFilter);
    this.height = height;
    this.width = width;
    this.dir = dir;
    this.duration = duration;
    this.noOfFrames = frames;
  }
  setRenderLoopTimestamp(timestamp: number) {
    if (timestamp !== this.renderLoopTimestamp) {
      this.renderLoopTimestamp = timestamp;
    }
  }
}
