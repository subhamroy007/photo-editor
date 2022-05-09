import FilterMaterial from "./FilterMaterial";
import Texture from "./Texture";

export default class EffectMaterial extends FilterMaterial {
  overlay: Texture;
  isEffectMaterial: boolean = true;
  constructor(target: Texture, overlay: Texture, name: string) {
    super(target, name);
    this.overlay = overlay;
  }
}
