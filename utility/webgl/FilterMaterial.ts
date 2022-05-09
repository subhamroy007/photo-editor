import { Matrix } from "ml-matrix";
import { Extrapolation, interpolate } from "react-native-reanimated";
import { TransitionProperty } from "../../constants/types";
import {
  evaluatePropertyValue,
  getTransitionValue,
} from "../../constants/utility";
import BasicMaterial from "./BasicMaterial";
import Texture from "./Texture";

export default class FilterMaterial extends BasicMaterial {
  brightness: number = 0;
  contrast: number = 1;
  isColorMatrixUpdateRequired: boolean = true;
  colorMatrix: Matrix;
  isFilterMaterial: boolean = true;

  constructor(target: Texture, name: string) {
    super(target, name);
    this.colorMatrix = Matrix.identity(5, 5, 1);
  }

  updateColorMatrix() {
    if (this.isColorMatrixUpdateRequired) {
      //setup brightness matrix
      const brightnessMatrix = Matrix.identity(5, 5);

      brightnessMatrix.set(4, 0, this.brightness);
      brightnessMatrix.set(4, 1, this.brightness);
      brightnessMatrix.set(4, 2, this.brightness);

      //setup contrast matrix
      const contrastMatrix = Matrix.identity(5, 5);

      const translate = (1 - this.contrast) / 2;
      contrastMatrix.set(0, 0, this.contrast);
      contrastMatrix.set(1, 1, this.contrast);
      contrastMatrix.set(2, 2, this.contrast);
      contrastMatrix.set(4, 0, translate);
      contrastMatrix.set(4, 1, translate);
      contrastMatrix.set(4, 2, translate);

      this.colorMatrix = brightnessMatrix.mmul(contrastMatrix);

      this.isColorMatrixUpdateRequired = false;
    }
  }

  setBrightness(value: number) {
    value = interpolate(
      value,
      [-100, 0, 100],
      [-0.6, 0, 0.6],
      Extrapolation.CLAMP
    );
    if (value !== this.brightness) {
      this.brightness = value;
      this.isColorMatrixUpdateRequired = true;
    }
  }
  setContrast(value: number) {
    value = interpolate(
      value,
      [-100, 0, 100],
      [-0.7, 1.0, 2.3],
      Extrapolation.CLAMP
    );
    if (value !== this.contrast) {
      this.contrast = value;
      this.isColorMatrixUpdateRequired = true;
    }
  }
}
