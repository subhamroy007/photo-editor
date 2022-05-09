import { useBackHandler, useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppContainer } from "./AppContainer";
import { AppLabel } from "./AppLabel";

export type AppModalProps = {
  children: ReactNode;
  title: string;
  restPoints?: number[];
  onClose: () => void;
};

export function AppModal({
  children,
  title,
  restPoints,
  onClose,
}: AppModalProps) {
  restPoints = restPoints ? [0, ...restPoints, 1] : [0, 1];

  const offset = useSharedValue(0);
  const start = useSharedValue(0);

  const { height, onLayout } = useLayout();

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: offset.value }],
      opacity: height === 0 ? 0 : 1,
    }),
    [height]
  );

  const calculateBounds = useCallback(() => {
    let upperBound = height;
    let lowerBound = 0;
    for (let i = 0; i < restPoints!.length - 1; i++) {
      if (
        offset.value <= restPoints![i + 1] * height &&
        offset.value >= restPoints![i] * height
      ) {
        upperBound = restPoints![i + 1] * height;
        lowerBound = restPoints![i] * height;
        break;
      }
    }
    return [lowerBound, upperBound];
  }, [restPoints, height]);

  const shiftModal = useCallback(
    (velocity: number) => {
      const [lowerBound, upperBound] = calculateBounds();
      if (velocity < 2000 && velocity > -2000) {
        if (offset.value < (upperBound + lowerBound) / 2) {
          offset.value = withTiming(
            lowerBound,
            {
              duration: 200,
              easing: Easing.linear,
            },
            () => {
              start.value = offset.value;
            }
          );
        } else {
          offset.value = withTiming(
            upperBound,
            {
              duration: 200,
              easing: Easing.linear,
            },
            () => {
              start.value = offset.value;
              if (upperBound === height) {
                runOnJS(onClose)();
              }
            }
          );
        }
      } else {
        if (velocity < 0) {
          offset.value = withTiming(
            lowerBound,
            {
              duration: 200,
              easing: Easing.linear,
            },
            () => {
              start.value = offset.value;
            }
          );
        } else {
          offset.value = withTiming(
            upperBound,
            {
              duration: 200,
              easing: Easing.linear,
            },
            () => {
              start.value = offset.value;
              if (upperBound === height) {
                runOnJS(onClose)();
              }
            }
          );
        }
      }
    },
    [onClose, height, calculateBounds]
  );

  useEffect(() => {
    offset.value = height;
    offset.value = withTiming(
      0,
      {
        duration: 400,
        easing: Easing.linear,
      },
      () => {
        start.value = offset.value;
      }
    );
  }, [height]);

  useBackHandler(() => {
    offset.value = withTiming(
      height,
      {
        duration: 2000,
        easing: Easing.linear,
      },
      () => {
        runOnJS(onClose)();
      }
    );
    return true;
  });

  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = Math.min(
        height,
        Math.max(0, e.translationY + start.value)
      );
    })
    .onEnd((e) => {
      runOnJS(shiftModal)(e.velocityY);
    });
  return (
    <AppContainer
      styleProp={[StyleSheet.absoluteFill]}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      majorAxisAlignment="end"
    >
      <GestureDetector gesture={dragGesture}>
        <Animated.View
          style={[{ alignSelf: "stretch" }, animatedStyle]}
          onLayout={onLayout}
        >
          <AppContainer
            backgroundColor="white"
            borderTopRadius={12}
            minorAxisAlignment="center"
            selfAlignment="stretch"
            paddingTop={16}
          >
            <AppLabel text={title} foreground="black" style="bold" />
            <AppContainer
              styleProp={{ marginTop: 16 }}
              selfAlignment="stretch"
              borderTopWidth={StyleSheet.hairlineWidth}
              borderColor="#d1cbcb"
            >
              {children}
            </AppContainer>
          </AppContainer>
        </Animated.View>
      </GestureDetector>
    </AppContainer>
  );
}
