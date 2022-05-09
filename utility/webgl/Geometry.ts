import { ExpoWebGLRenderingContext } from "expo-gl";
import { Attribute } from "./Attribute";
import Core from "./Core";

export interface DrawRange {
  start: number;
  count: number;
}

export default class Geometry {
  static geometryCount: number = 0;
  attributes: {
    [key: string]: Attribute | null;
  } | null = null;
  index: Attribute | null = null;
  range: DrawRange | null = null;
  buffers: {
    attributes: {
      [key: string]: WebGLBuffer | null;
    };
    index: WebGLBuffer | null;
  } | null = null;
  isUpdateRequired: boolean = true;
  name: string;

  constructor(name: string = "") {
    this.name = name === "" ? `geometry-${Geometry.geometryCount}` : name;
    Geometry.geometryCount += 1;
  }

  setIndex(index: Attribute) {
    this.index = index;
    this.range = {
      start: 0,
      count: this.index.array.length,
    };
  }

  setAttribute(attribute: Attribute) {
    if (!this.attributes) {
      this.attributes = {};
    }
    this.attributes[attribute.name] = attribute;
  }

  getBuffer(gl: ExpoWebGLRenderingContext) {
    if (this.isUpdateRequired && this.attributes && this.index) {
      const attributeNames = Object.keys(this.attributes);
      this.buffers = {
        attributes: {},
        index: null,
      };

      this.buffers.index = Core.createAndPopulateBuffer(
        gl,
        gl.ELEMENT_ARRAY_BUFFER,
        this.index.array,
        this.index.type,
        this.index.usage
      );

      attributeNames.forEach(
        (attributeName) =>
          (this.buffers!.attributes[attributeName] =
            Core.createAndPopulateBuffer(
              gl,
              gl.ARRAY_BUFFER,
              this.attributes![attributeName]!.array,
              this.attributes![attributeName]!.type,
              this.attributes![attributeName]!.usage
            ))
      );

      this.isUpdateRequired = false;
    }

    return this.buffers;
  }

  getAttribute(name: string) {
    return this.attributes![name];
  }
}
