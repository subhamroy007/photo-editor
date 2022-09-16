import { useCallback, useRef } from "react";
import { PanResponder, PanResponderInstance } from "react-native";

const LONG_PRESS_TIME = 400;
const DOUBLE_TAP_TIME = 200;

export function useDiscreteGesture(
  onPress?: () => void,
  onLongPress?: () => void,
  onDoubleTap?: () => void
) {
  const longPressTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const timestampRef = useRef<number>(-1);
  const touchCount = useRef<number>(0);
  const pressTimeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    touchCount.current = 0;
    timestampRef.current = -1;
    if (longPressTimeoutIdRef.current) {
      clearTimeout(longPressTimeoutIdRef.current);
      longPressTimeoutIdRef.current = null;
    }
    if (pressTimeoutIdRef.current) {
      clearTimeout(pressTimeoutIdRef.current);
      pressTimeoutIdRef.current = null;
    }
  }, []);

  const responder = useRef<PanResponderInstance>(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        timestampRef.current = Date.now();
        longPressTimeoutIdRef.current = setTimeout(() => {
          console.log("long pressed");
          reset();
        }, LONG_PRESS_TIME);
        if (touchCount.current === 1) {
          console.log("double tapped");
          reset();
        } else {
          touchCount.current += 1;
        }
      },
      onPanResponderMove: (_, { dx, dy }) => {
        if (dx !== 0 || dy !== 0) {
          reset();
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const currentTime = Date.now();
        if (currentTime - timestampRef.current < LONG_PRESS_TIME) {
          if (longPressTimeoutIdRef.current) {
            clearTimeout(longPressTimeoutIdRef.current);
            longPressTimeoutIdRef.current = null;
          }
        }
        if (touchCount.current === 1) {
          if (currentTime - timestampRef.current <= DOUBLE_TAP_TIME) {
            pressTimeoutIdRef.current = setTimeout(() => {
              console.log("pressed");
              reset();
            }, DOUBLE_TAP_TIME);
          } else {
            console.log("pressed");
            reset();
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        reset();
      },
    })
  ).current;

  return responder;
}
