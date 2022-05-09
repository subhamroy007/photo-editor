import Texture, {
  TextureMagFilter,
  TextureMinFilter,
  TextureWrapType,
} from "./Texture";

export default class ImageTexture extends Texture {
  uri: string;
  width: number;
  height: number;
  isImageTexture: boolean = true;
  constructor(
    uri: string,
    width: number,
    height: number,
    wrapS?: TextureWrapType,
    wrapT?: TextureWrapType,
    minFilter?: TextureMinFilter,
    magFilter?: TextureMagFilter,
    name?: string
  ) {
    super(name, wrapS, wrapT, minFilter, magFilter);
    this.uri = uri;
    this.width = width;
    this.height = height;
  }
}
