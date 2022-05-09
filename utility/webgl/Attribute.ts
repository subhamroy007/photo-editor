export type AttributeType =
  | "FLOAT"
  | "SHORT"
  | "USHORT"
  | "BYTE"
  | "UBYTE"
  | "INT"
  | "UINT";

export type AttributeUsage = "STATIC_DRAW" | "DYNAMIC_DRAW" | "STREAM_DRAW";

export class Attribute {
  array: number[];
  noOfComponents: number;
  count: number;
  type: AttributeType;
  name: string;
  normalize: boolean;
  usage: AttributeUsage;
  constructor(
    name: string,
    array: number[],
    noOfComponents: number,
    type: AttributeType,
    normalize: boolean = false,
    usgae: AttributeUsage = "STATIC_DRAW"
  ) {
    this.name = name;
    this.array = array;
    this.noOfComponents = noOfComponents;
    this.type = type;
    this.count = this.array.length / this.noOfComponents;
    this.normalize = normalize;
    this.usage = usgae;
  }
}
