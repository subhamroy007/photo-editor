import { useCallback, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function usePinchToZoomGesture(
  horizontalLimit: number,
  verticalLimit: number,
  onPinchStart: (scale: number) => void,
  onPinchEnd: (scale: number) => void,
  onReset: () => void,
  isEnabled: boolean
) {
  const zoomScale = useSharedValue(1);
  const zoomOffset = useSharedValue(1);

  const translationXValue = useSharedValue(0);
  const translationXOffset = useSharedValue(0);

  const translationYValue = useSharedValue(0);
  const translationYOffset = useSharedValue(0);

  const [isDragEnabled, setDragEnabled] = useState(false);

  const pinchStartCallback = useCallback((scale: number) => {
    setDragEnabled(true);
    onPinchStart(scale);
  }, []);

  const pinchEndCallback = useCallback((scale: number) => {
    if (scale === 1) {
      setDragEnabled(false);
    }
    onPinchEnd(scale);
  }, []);

  const tapHandler = useCallback(() => {
    setDragEnabled(false);
    onReset();
  }, []);

  const dragGesture = Gesture.Pan()
    .enabled(isDragEnabled && isEnabled)
    .onUpdate(({ translationX, translationY }) => {
      const allowedXTranslation = Math.floor(
        (zoomScale.value - 1) * horizontalLimit * 0.25
      );
      const allowedYTranslation = Math.floor(
        (zoomScale.value - 1) * verticalLimit * 0.25
      );

      translationXValue.value = Math.min(
        allowedXTranslation,
        Math.max(-allowedXTranslation, translationX + translationXOffset.value)
      );

      translationYValue.value = Math.min(
        allowedYTranslation,
        Math.max(-allowedYTranslation, translationY + translationYOffset.value)
      );
    })
    .onEnd(() => {
      translationXOffset.value = translationXValue.value;
      translationYOffset.value = translationYValue.value;
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isEnabled)
    .onStart(() => {
      runOnJS(pinchStartCallback)(zoomScale.value);
    })
    .onUpdate(({ scale }) => {
      zoomScale.value = Math.min(2, Math.max(1, zoomOffset.value * scale));
    })
    .onEnd(() => {
      zoomOffset.value = zoomScale.value;
      runOnJS(pinchEndCallback)(zoomScale.value);
    });

  const tapGesture = Gesture.Tap()
    .enabled(isEnabled)
    .onStart(() => {
      if (zoomScale.value !== 1) {
        zoomOffset.value = 1;
        translationXOffset.value = 0;
        translationYOffset.value = 0;
        zoomScale.value = withTiming(1, {
          duration: 100,
          easing: Easing.linear,
        });
        translationXValue.value = withTiming(0, {
          duration: 100,
          easing: Easing.linear,
        });
        translationYValue.value = withTiming(0, {
          duration: 100,
          easing: Easing.linear,
        });
      }
      runOnJS(tapHandler)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: zoomScale.value,
        },
        {
          translateX: translationXValue.value,
        },
        { translateY: translationYValue.value },
      ],
    };
  });

  return { animatedStyle, tapGesture, pinchGesture, dragGesture };
}
