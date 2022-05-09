import { ExpoWebGLRenderingContext } from "expo-gl";
import { mat4 } from "gl-matrix";
import BasicMaterial from "./BasicMaterial";
import Core from "./Core";
import EffectMaterial from "./EffectMaterial";
import FilterMaterial from "./FilterMaterial";
import { getTextureIndex } from "./Texture";

export function isBasicMaterial(material: Material): material is BasicMaterial {
  return (
    (material as BasicMaterial).isBasicMaterial !== undefined &&
    (material as BasicMaterial).isBasicMaterial === true
  );
}

export function isFilterMaterial(
  material: Material
): material is FilterMaterial {
  return (
    (material as FilterMaterial).isFilterMaterial !== undefined &&
    (material as FilterMaterial).isFilterMaterial === true
  );
}

export function isEffectMaterial(
  material: Material
): material is EffectMaterial {
  return (
    (material as EffectMaterial).isEffectMaterial !== undefined &&
    (material as EffectMaterial).isEffectMaterial === true
  );
}

export default class Material {
  static materialCount: number = 0;
  program: WebGLProgram | null = null;
  uniforms: {
    [key: string]: WebGLUniformLocation | null;
  } | null = null;
  isUpdateRequired: boolean = true;
  isMaterial: boolean = true;
  name: string;
  constructor(name: string = "") {
    this.name = name === "" ? `material-${Material.materialCount}` : name;
    Material.materialCount += 1;
  }

  initProgramAndUniformLocations(gl: ExpoWebGLRenderingContext) {
    if (this.isUpdateRequired) {
      let vsSource = `
            precision highp float;
            attribute vec4 a_position;
            ${isBasicMaterial(this) ? "attribute vec2 a_uv;\n" : ""}
            uniform mat4 u_projectionMatrix;
            uniform mat4 u_viewMatrix;
            uniform mat4 u_worldMatrix;

            ${isBasicMaterial(this) ? "varying vec2 v_uv;\n" : ""}

            void main(void){
                vec4 clipPosition = u_projectionMatrix * u_viewMatrix * u_worldMatrix * a_position;
                gl_Position = clipPosition;
                ${isBasicMaterial(this) ? "v_uv = a_uv;\n" : ""}
            }
        `;
      let fsSource = `
            precision highp float;
            ${isBasicMaterial(this) ? "varying vec2 v_uv;\n" : ""}
            ${
              isBasicMaterial(this)
                ? `uniform sampler2D u_${this.target.name};\n`
                : ""
            }
            ${
              isEffectMaterial(this)
                ? `uniform sampler2D u_${this.overlay.name};\n`
                : ""
            }
            ${
              isFilterMaterial(this)
                ? "uniform mat4 u_ccMatrix;\nuniform vec4 u_ccVector;\n"
                : ""
            }

            void main(void){
                vec4 targetPixel = vec4(0, 0, 0, 0);
                ${
                  isBasicMaterial(this)
                    ? `targetPixel = texture2D(u_${this.target.name}, vec2(v_uv.x, v_uv.y));\n`
                    : ""
                }
                ${
                  isEffectMaterial(this)
                    ? `vec4 overlayPixel = texture2D(u_${this.overlay.name}, vec2(v_uv.x, v_uv.y));\ntargetPixel = vec4(targetPixel.xyz + overlayPixel.xyz, targetPixel.w);\n`
                    : ""
                }
                ${
                  isFilterMaterial(this)
                    ? "targetPixel = u_ccMatrix * targetPixel + u_ccVector;\n"
                    : ""
                }
                gl_FragColor = targetPixel;
            }
        `;
      this.program = Core.createProgram(gl, fsSource, vsSource);
      this.uniforms = {};
      this.uniforms["projectionMatrix"] = Core.findUniformLocations(
        gl,
        this.program,
        "projectionMatrix"
      );
      this.uniforms["viewMatrix"] = Core.findUniformLocations(
        gl,
        this.program,
        "viewMatrix"
      );
      this.uniforms["worldMatrix"] = Core.findUniformLocations(
        gl,
        this.program,
        "worldMatrix"
      );
      if (isBasicMaterial(this)) {
        const targetTextureLocation = Core.findUniformLocations(
          gl,
          this.program,
          this.target.name
        );
        this.uniforms[this.target.name] = targetTextureLocation;
      }

      if (isFilterMaterial(this)) {
        this.uniforms["ccMatrix"] = Core.findUniformLocations(
          gl,
          this.program,
          "ccMatrix"
        );
        this.uniforms["ccVector"] = Core.findUniformLocations(
          gl,
          this.program,
          "ccVector"
        );
      }

      if (isEffectMaterial(this)) {
        const overlayTextureLocation = Core.findUniformLocations(
          gl,
          this.program,
          this.overlay.name
        );
        this.uniforms[this.overlay.name] = overlayTextureLocation;
      }
      this.isUpdateRequired = false;
    }
  }

  async useMaterial(
    gl: ExpoWebGLRenderingContext,
    projectionMatrix: mat4,
    viewMatrix: mat4,
    worldMatrix: mat4
  ) {
    this.initProgramAndUniformLocations(gl);
    gl.useProgram(this.program);

    if (!this.uniforms) {
      return;
    }
    gl.uniformMatrix4fv(
      this.uniforms!["projectionMatrix"],
      false,
      projectionMatrix
    );

    gl.uniformMatrix4fv(this.uniforms!["viewMatrix"], false, viewMatrix);

    gl.uniformMatrix4fv(this.uniforms!["worldMatrix"], false, worldMatrix);

    if (isBasicMaterial(this)) {
      const targetTexture = await this.target.getTexture(gl);
      gl.activeTexture(getTextureIndex(gl, this.target.index));
      gl.bindTexture(gl.TEXTURE_2D, targetTexture);
      gl.uniform1i(this.uniforms![this.target.name], this.target.index);
    }

    if (isFilterMaterial(this)) {
      this.updateColorMatrix();
      const ccVector = this.colorMatrix
        .selection([4], [0, 1, 2, 3])
        .to1DArray();
      const ccMatrix = this.colorMatrix
        .selection([0, 1, 2, 3], [0, 1, 2, 3])
        .to1DArray();

      gl.uniformMatrix4fv(this.uniforms!["ccMatrix"], false, ccMatrix);
      gl.uniform4fv(this.uniforms!["ccVector"], ccVector);
    }

    if (isEffectMaterial(this)) {
      const targetTexture = await this.overlay.getTexture(gl);
      gl.activeTexture(getTextureIndex(gl, this.overlay.index));
      gl.bindTexture(gl.TEXTURE_2D, targetTexture);
      gl.uniform1i(this.uniforms![this.overlay.name], this.overlay.index);
    }

    return this.program;
  }
}
