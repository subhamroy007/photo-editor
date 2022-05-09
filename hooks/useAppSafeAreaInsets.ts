import { StatusBar } from "react-native";
import {
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const useAppSafeAreaInsets = () => {
  const {
    top: insetTop,
    bottom: insetBottom,
    left: insetLeft,
    right: insetRight,
  } = useSafeAreaInsets();

  const metricsTop = initialWindowMetrics?.insets
    ? initialWindowMetrics.insets.top
    : 0;
  const metricsBottom = initialWindowMetrics?.insets
    ? initialWindowMetrics.insets.bottom
    : 0;
  const metricsLeft = initialWindowMetrics?.insets
    ? initialWindowMetrics.insets.left
    : 0;
  const metricsRight = initialWindowMetrics?.insets
    ? initialWindowMetrics.insets.right
    : 0;

  const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

  return {
    top: Math.max(statusBarHeight, insetTop, metricsTop),
    bottom: Math.max(insetBottom, metricsBottom),
    left: Math.max(insetLeft, metricsLeft),
    right: Math.max(insetRight, metricsRight),
  };
};

export default useAppSafeAreaInsets;
