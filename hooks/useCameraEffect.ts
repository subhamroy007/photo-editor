import { Camera } from "expo-camera";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getCameraPosition } from "../components/PhotoPreview";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/constants";
import { EffectParams, TransitionProperty } from "../constants/types";
import {
  evaluatePropertyValue,
  fromPropertyToNumberOrTransitionProperty,
} from "../constants/utility";
import { Attribute } from "../utility/webgl/Attribute";
import CameraTexture from "../utility/webgl/CameraTexture";
import EffectMaterial from "../utility/webgl/EffectMaterial";
import FilterMaterial from "../utility/webgl/FilterMaterial";
import FrameGeometry from "../utility/webgl/FrameGeometry";
import ImageTexture from "../utility/webgl/ImageTexture";
import Material, { isFilterMaterial } from "../utility/webgl/Material";
import Node3D from "../utility/webgl/Node";
import { ProspectiveCamera } from "../utility/webgl/ProspectiveCamera";
import { Renderer } from "../utility/webgl/Renderer";
import Texture, { isVideoTexture } from "../utility/webgl/Texture";
import VideoTexture from "../utility/webgl/VideoTexture";
import { useMedia } from "./useMedia";

export type PropertyMap = {
  [key: string]: number | TransitionProperty;
};

export type TextureMap = {
  [key: string]: Texture;
};

export type MaterialMap = {
  [key: string]: {
    material: Material;
    properties: PropertyMap;
  };
};

export type FrameMap = {
  [key: string]: {
    frame: Node3D;
    properties: PropertyMap;
  };
};

export interface EffectCanvasParams {
  renderer: Renderer | null;
  scene: Node3D | null;
  prospectiveCamera: ProspectiveCamera | null;
  textureMap: TextureMap;
  materialMap: MaterialMap;
  frameMap: FrameMap;
}

export function useCameraEffect(
  effect: EffectParams,
  camera: MutableRefObject<Camera | null>,
  canvas: MutableRefObject<GLView | null>,
  context: MutableRefObject<ExpoWebGLRenderingContext | null>,
  isCameraReady: boolean,
  isCanvasReady: boolean
) {
  const { frames, materials, medias, metadata, textures } = effect;

  const {
    error: mediaError,
    loaded: isMediaLoaded,
    mediaMap: loadedMediaMap,
  } = useMedia(medias);
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);

  const [isEffectInitialized, setEffectInitialized] = useState(false);

  const canvasParams = useRef<EffectCanvasParams>({
    frameMap: {},
    materialMap: {},
    prospectiveCamera: null,
    renderer: null,
    scene: null,
    textureMap: {},
  });

  const initCanvasParams = useCallback(
    (textureMap: TextureMap, materialMap: MaterialMap, frameMap: FrameMap) => {
      canvasParams.current.scene?.removeAll();
      canvasParams.current.frameMap = frameMap;
      canvasParams.current.materialMap = materialMap;
      canvasParams.current.textureMap = textureMap;
      Object.values(frameMap).forEach((frame) => {
        canvasParams.current.scene?.add(frame.frame);
      });
      console.log("canvas params loaded");
    },
    []
  );

  const initCanvas = useCallback(() => {
    canvasParams.current.renderer = new Renderer(context.current!);
    canvasParams.current.scene = new Node3D();
    canvasParams.current.prospectiveCamera = new ProspectiveCamera(
      SCREEN_WIDTH / SCREEN_HEIGHT,
      0,
      1000,
      70
    );
    canvasParams.current.prospectiveCamera.setTranslationX(0);
    canvasParams.current.prospectiveCamera.setTranslationY(0);
    canvasParams.current.prospectiveCamera.setTranslationZ(
      getCameraPosition(70, SCREEN_WIDTH, SCREEN_HEIGHT)
    );
    setCanvasInitialized(true);
    console.log("canvas initialized");
  }, []);

  const initEffect = useCallback(() => {
    if (isMediaLoaded && !mediaError) {
      const textureMap: TextureMap = {};

      if (metadata.target === "camera") {
        textureMap["camera"] = new CameraTexture(
          camera.current!,
          canvas.current!,
          "camera"
        );
      }

      const materialMap: MaterialMap = {};
      const frameMap: FrameMap = {};

      //create and store all the textures
      textures.forEach((texture) => {
        const targetMedia = loadedMediaMap[texture.media];
        let targetTexture = null;
        if (targetMedia.type === "photo") {
          targetTexture = new ImageTexture(
            targetMedia.localUri,
            targetMedia.width,
            targetMedia.height,
            texture.wrapX,
            texture.wrapY,
            texture.minFilter,
            texture.magFilter,
            texture.name
          );
        } else {
          targetTexture = new VideoTexture(
            targetMedia.localUri,
            targetMedia.width,
            targetMedia.height,
            targetMedia.duration,
            targetMedia.frame,
            texture.wrapX,
            texture.wrapY,
            texture.minFilter,
            texture.magFilter,
            texture.name
          );
        }
        textureMap[texture.name] = targetTexture;
      });

      //create and store all the materials
      materials.forEach((material) => {
        let targetMaterial = null;
        if (material.texture.overlay) {
          targetMaterial = new EffectMaterial(
            textureMap[material.texture.target],
            textureMap[material.texture.overlay],
            material.name
          );
        } else {
          targetMaterial = new FilterMaterial(
            textureMap[material.texture.target],
            material.name
          );
        }

        const propMap: PropertyMap = {};

        const { brightness, contrast } = material.colorMatrix;

        if (brightness) {
          propMap["brightness"] =
            fromPropertyToNumberOrTransitionProperty(brightness);
        }

        if (contrast) {
          propMap["contrast"] =
            fromPropertyToNumberOrTransitionProperty(contrast);
        }

        materialMap[material.name] = {
          material: targetMaterial,
          properties: propMap,
        };
      });

      //create all the frames
      frames.forEach((frame) => {
        const targetGeometry = new FrameGeometry(frame.name + "geomtery");

        if (frame.uv) {
          targetGeometry.setAttribute(
            new Attribute("uv", frame.uv, 2, "FLOAT")
          );
        }

        const targetFrame = new Node3D(
          targetGeometry,
          materialMap[frame.material].material,
          frame.name
        );

        const {
          translationX,
          translationY,
          translationZ,
          rotationX,
          rotationY,
          rotationZ,
          scaleX,
          scaleY,
          scaleZ,
        } = frame;

        const propMap: PropertyMap = {};

        if (translationX) {
          propMap["translationX"] =
            fromPropertyToNumberOrTransitionProperty(translationX);
        }

        if (translationY) {
          propMap["translationY"] =
            fromPropertyToNumberOrTransitionProperty(translationY);
        }

        if (translationZ) {
          propMap["translationZ"] =
            fromPropertyToNumberOrTransitionProperty(translationZ);
        }

        if (scaleX) {
          propMap["scaleX"] = fromPropertyToNumberOrTransitionProperty(scaleX);
        }

        if (scaleY) {
          propMap["scaleY"] = fromPropertyToNumberOrTransitionProperty(scaleY);
        }

        if (scaleZ) {
          propMap["scaleZ"] = fromPropertyToNumberOrTransitionProperty(scaleZ);
        }

        if (rotationX) {
          propMap["rotationX"] =
            fromPropertyToNumberOrTransitionProperty(rotationX);
        }

        if (rotationY) {
          propMap["rotationY"] =
            fromPropertyToNumberOrTransitionProperty(rotationY);
        }

        if (rotationZ) {
          propMap["rotationZ"] =
            fromPropertyToNumberOrTransitionProperty(rotationZ);
        }
        frameMap[frame.name] = {
          frame: targetFrame,
          properties: propMap,
        };
      });

      initCanvasParams(textureMap, materialMap, frameMap);
      setEffectInitialized(true);
      console.log("effect initialized");
    }
  }, [loadedMediaMap, isMediaLoaded, mediaError, initCanvasParams]);

  const renderEffect = useCallback(
    async (
      timeLag: number,
      totalTimePassed: number,
      lastFrameTimestamp: number
    ) => {
      const {
        prospectiveCamera,
        scene,
        renderer,
        materialMap,
        textureMap,
        frameMap,
      } = canvasParams.current;
      Object.values(textureMap).forEach((texture) => {
        if (isVideoTexture(texture)) {
          texture.setRenderLoopTimestamp(totalTimePassed);
        }
      });

      Object.values(materialMap).forEach((material) => {
        if (isFilterMaterial(material.material)) {
          if (material.properties["brightness"]) {
            material.material.setBrightness(
              evaluatePropertyValue(
                material.properties["brightness"],
                totalTimePassed
              )
            );
          }
          if (material.properties["contrast"]) {
            material.material.setContrast(
              evaluatePropertyValue(
                material.properties["contrast"],
                totalTimePassed
              )
            );
          }
        }
      });

      Object.values(frameMap).forEach((frame) => {
        if (frame.properties["translationX"]) {
          frame.frame.setTranslationX(
            evaluatePropertyValue(
              frame.properties["translationX"],
              totalTimePassed
            )
          );
        }
        if (frame.properties["translationY"]) {
          frame.frame.setTranslationY(
            evaluatePropertyValue(
              frame.properties["translationY"],
              totalTimePassed
            )
          );
        }
        if (frame.properties["translationZ"]) {
          frame.frame.setTranslationZ(
            evaluatePropertyValue(
              frame.properties["translationZ"],
              totalTimePassed
            )
          );
        }

        if (frame.properties["scaleX"]) {
          frame.frame.setScaleX(
            evaluatePropertyValue(frame.properties["scaleX"], totalTimePassed)
          );
        }
        if (frame.properties["scaleY"]) {
          frame.frame.setScaleY(
            evaluatePropertyValue(frame.properties["scaleY"], totalTimePassed)
          );
        }
        if (frame.properties["scaleZ"]) {
          frame.frame.setScaleZ(
            evaluatePropertyValue(frame.properties["scaleZ"], totalTimePassed)
          );
        }

        if (frame.properties["rotationX"]) {
          frame.frame.setRotationX(
            evaluatePropertyValue(
              frame.properties["rotationX"],
              totalTimePassed
            )
          );
        }
        if (frame.properties["rotationY"]) {
          frame.frame.setRotationY(
            evaluatePropertyValue(
              frame.properties["rotationY"],
              totalTimePassed
            )
          );
        }
        if (frame.properties["rotationZ"]) {
          frame.frame.setRotationZ(
            evaluatePropertyValue(
              frame.properties["rotationZ"],
              totalTimePassed
            )
          );
        }
      });

      await renderer!.render(prospectiveCamera!, scene!);
    },
    []
  );

  useEffect(() => {
    if (isCameraReady && isCanvasReady) {
      if (!isCanvasInitialized) {
        initCanvas();
      }
      if (!isEffectInitialized) {
        initEffect();
      }
    }
  }, [
    isCameraReady,
    isCanvasReady,
    initEffect,
    initCanvas,
    isCanvasInitialized,
    isEffectInitialized,
  ]);

  useEffect(() => {
    setEffectInitialized(false);
  }, [effect]);

  return { isEffectInitialized, renderEffect };
}
