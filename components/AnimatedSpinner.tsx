import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function AnimatedSpinner() {
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
        easing: Easing.linear,
      }),
      { resetBeforeIteration: true, iterations: -1 }
    ).start();
  }, [animatedValue]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0 + "deg", 360 + "deg"],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
    >
      <EvilIcons name="spinner-3" size={48} color="black" />
    </Animated.View>
  );
}
