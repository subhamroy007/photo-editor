import Material from "./Material";
import Texture from "./Texture";

export default class BasicMaterial extends Material {
  isBasicMaterial: boolean = true;
  target: Texture;
  constructor(target: Texture, name: string) {
    super(name);
    this.target = target;
  }
}
