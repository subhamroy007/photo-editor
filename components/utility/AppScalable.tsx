import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type AppScalableProps = {
  onStart: (scale: number) => void;
  onEnd: (scale: number) => void;
  onReset: () => void;
  children: ReactNode;
  enabled?: boolean;
  styleProp?: StyleProp<ViewStyle>;
};

export function AppScalable({
  children,
  onEnd,
  onReset,
  onStart,
  enabled,
  styleProp,
}: AppScalableProps) {
  enabled = enabled === undefined ? true : enabled;
  const { height, width, onLayout } = useLayout();

  const zoomScale = useSharedValue(1);
  const zoomOffset = useSharedValue(1);

  const translationXValue = useSharedValue(0);
  const translationXOffset = useSharedValue(0);

  const translationYValue = useSharedValue(0);
  const translationYOffset = useSharedValue(0);

  const [isDragEnabled, setDragEnabled] = useState(false);

  const pinchStartCallback = useCallback((scale: number) => {
    setDragEnabled(true);
    onStart(scale);
  }, []);

  const pinchEndCallback = useCallback((scale: number) => {
    if (scale === 1) {
      setDragEnabled(false);
    }
    onEnd(scale);
  }, []);

  const tapHandler = useCallback(() => {
    setDragEnabled(false);
    onReset();
  }, []);

  const dragGesture = Gesture.Pan()
    .enabled(isDragEnabled && enabled!)
    .onUpdate(({ translationX, translationY }) => {
      const allowedXTranslation = Math.floor(
        (zoomScale.value - 1) * width * 0.25
      );
      const allowedYTranslation = Math.floor(
        (zoomScale.value - 1) * height * 0.25
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
    .enabled(enabled!)
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
    .enabled(enabled! && isDragEnabled)
    .onStart(() => {
      if (zoomScale.value !== 1) {
        zoomOffset.value = 1;
        translationXOffset.value = 0;
        translationYOffset.value = 0;
        zoomScale.value = withTiming(
          1,
          {
            duration: 100,
            easing: Easing.linear,
          },
          () => {
            runOnJS(tapHandler)();
          }
        );
        translationXValue.value = withTiming(0, {
          duration: 100,
          easing: Easing.linear,
        });
        translationYValue.value = withTiming(0, {
          duration: 100,
          easing: Easing.linear,
        });
      }
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

  const compositeGesture = Gesture.Exclusive(
    Gesture.Simultaneous(pinchGesture, dragGesture),
    tapGesture
  );

  return (
    <GestureDetector gesture={compositeGesture}>
      <Animated.View style={[animatedStyle, styleProp]} onLayout={onLayout}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
