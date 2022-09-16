import { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { globalStyles } from "../../constants/style";

type BouncerProps = {
  value: number;
  reset: () => void;
  children: ReactNode;
};

export function Bouncer({ value, children, reset }: BouncerProps) {
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    if (value !== 0) {
      animatedValue.stopAnimation();
      animatedValue.setValue(0);

      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 400,
          easing: Easing.elastic(1.2),
        }),
        Animated.delay(800),
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: true,
          duration: 200,
          easing: Easing.linear,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          reset();
        }
      });
    }
  }, [value]);

  return (
    <Animated.View
      style={[
        globalStyles.absolutePosition,
        globalStyles.alignSelfCenter,
        { transform: [{ scale: animatedValue }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}
