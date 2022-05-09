import { Attribute } from "./Attribute";
import Geometry from "./Geometry";

export default class FrameGeometry extends Geometry {
  constructor(name?: string) {
    super(name);

    const position = [
      -1 / 2,
      -1 / 2,
      0,
      1 / 2,
      -1 / 2,
      0,
      1 / 2,
      1 / 2,
      0,
      -1 / 2,
      1 / 2,
      0,
    ];
    const uv = [0, 1, 1, 1, 1, 0, 0, 0];
    const index = [0, 1, 2, 2, 3, 0];

    this.setIndex(new Attribute("index", index, 1, "USHORT"));
    this.setAttribute(new Attribute("position", position, 3, "FLOAT"));
    this.setAttribute(new Attribute("uv", uv, 2, "FLOAT"));
  }
}
