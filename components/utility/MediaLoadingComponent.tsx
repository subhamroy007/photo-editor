import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import {
  COLOR_8,
  IMAGE_BLUR_RADIUS,
  IMAGE_FADE_DURATION_MS,
  SIZE_17,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { MediaLoadingComponentProps } from "../../constants/types";
import { AppIcon } from "./AppIcon";
import { Tappable } from "./Tappable";

export function MediaLoadingComponent(props: MediaLoadingComponentProps) {
  const { isError, isLoading, onRetry, poster } = props;

  return (
    <Animated.View
      exiting={FadeOut.duration(IMAGE_FADE_DURATION_MS)}
      style={[
        globalStyles.absolutePosition,
        styles.poster,
        globalStyles.alignCenter,
        globalStyles.justifyCenter,
      ]}
    >
      <Image
        resizeMode="cover"
        style={[styles.poster]}
        source={{ uri: poster }}
        blurRadius={IMAGE_BLUR_RADIUS}
        fadeDuration={0}
      />
      {isLoading && (
        <View style={[globalStyles.absolutePosition, styles.loadingCirle]} />
      )}
      {isError && (
        <Tappable style={globalStyles.absolutePosition} onTap={onRetry}>
          <AppIcon name="undo" size="large" isBorderVisible />
        </Tappable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  poster: {
    width: "100%",
    height: "100%",
  },
  loadingCirle: {
    width: SIZE_17,
    height: SIZE_17,
    borderRadius: Math.round(SIZE_17 / 2),
    borderColor: COLOR_8,
    borderWidth: 2 * StyleSheet.hairlineWidth,
  },
});
