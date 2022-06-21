import { useBackHandler } from "@react-native-community/hooks";
import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SIZE_3, SIZE_5 } from "../../constants/constants";
import { AppContainer } from "./AppContainer";
import { AppLabel } from "./AppLabel";

export type ModalState = "OPEN" | "CLOSE";

export type AppModalStaticParams = {
  changeModalState: (to: ModalState) => void;
};

export type AppModalProps = {
  children: ReactNode;
  title: string;
  onDragStart?: (from: ModalState) => void;
  onDragEnd?: () => void;
  onAnimationStart?: (from: ModalState, to: ModalState) => void;
  onAnimationEnd?: (from: ModalState, to: ModalState) => void;
  height: number;
};

export const AppModal = React.forwardRef<AppModalStaticParams, AppModalProps>(
  (
    {
      children,
      height,
      title,
      onAnimationEnd,
      onAnimationStart,
      onDragEnd,
      onDragStart,
    },
    ref
  ) => {
    const animatedTranslation = useSharedValue(0);
    const animatedTranslationOffset = useSharedValue(0);

    const [modalState, setModalState] = useState<ModalState>("CLOSE");

    const switchModalState = useCallback((to: ModalState) => {
      setModalState(to);
    }, []);

    const modalAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: animatedTranslation.value }],
      };
    });

    const backgroundAnimationStyle = useAnimatedStyle(() => {
      const animatedAlpha = interpolate(
        animatedTranslation.value,
        [-height, 0],
        [0.6, 0],
        Extrapolate.CLAMP
      );
      return {
        backgroundColor: `rgba(0, 0, 0, ${animatedAlpha})`,
      };
    });

    const modalMoveHandler = useCallback(
      (to: ModalState) => {
        if (onAnimationStart) {
          onAnimationStart(modalState, to);
        }
        animatedTranslation.value = withTiming(
          to === "OPEN" ? -height : 0,
          {
            duration: 200,
          },
          (finish) => {
            if (finish) {
              animatedTranslationOffset.value = animatedTranslation.value;
              runOnJS(switchModalState)(to);
              if (onAnimationEnd) {
                runOnJS(onAnimationEnd)(modalState, to);
              }
            }
          }
        );
      },
      [height, onAnimationEnd, onAnimationStart, modalState, switchModalState]
    );

    const adjustModalPosition = useCallback(
      (postion: number, velocity: number) => {
        if (velocity < 2000 && velocity > -2000) {
          if (postion < -height / 2) {
            modalMoveHandler("OPEN");
          } else {
            modalMoveHandler("CLOSE");
          }
        } else {
          if (velocity < 0) {
            modalMoveHandler("OPEN");
          } else {
            modalMoveHandler("CLOSE");
          }
        }
      },
      [height, modalMoveHandler]
    );

    const dragGesture = Gesture.Pan()
      .onStart(() => {
        if (onDragStart) {
          runOnJS(onDragStart)(modalState);
        }
      })
      .onUpdate(({ translationY }) => {
        animatedTranslation.value = Math.max(
          -height,
          Math.min(0, translationY + animatedTranslationOffset.value)
        );
      })
      .onEnd(({ velocityY }) => {
        if (onDragEnd) {
          runOnJS(onDragEnd)();
        }
        runOnJS(adjustModalPosition)(animatedTranslation.value, velocityY);
      });

    useImperativeHandle(
      ref,
      () => {
        return {
          changeModalState: modalMoveHandler,
        };
      },
      [modalMoveHandler]
    );

    useBackHandler(() => {
      if (modalState === "OPEN") {
        modalMoveHandler("CLOSE");
        return true;
      }
      return false;
    });

    return (
      <AppContainer styleProp={StyleSheet.absoluteFill}>
        <GestureDetector gesture={dragGesture}>
          <Animated.View style={[styles.background, backgroundAnimationStyle]}>
            <Animated.View
              style={[
                styles.modal,
                modalAnimatedStyle,
                { height, bottom: -height },
              ]}
            >
              <AppContainer
                borderTopRadius={SIZE_5}
                paddingBottom={SIZE_3}
                paddingLeft={SIZE_3}
                paddingRight={SIZE_3}
                paddingTop={SIZE_3}
                borderBottomWidth={StyleSheet.hairlineWidth}
                selfAlignment="stretch"
              >
                <AppLabel text={title} foreground="black" style="bold" />
              </AppContainer>
              {children}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </AppContainer>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderTopStartRadius: SIZE_5,
    borderTopEndRadius: SIZE_5,
    alignSelf: "stretch",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  background: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
});
