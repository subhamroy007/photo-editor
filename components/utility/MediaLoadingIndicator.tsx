import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import {
  COLOR_8,
  NETWORK_ERROR_CODE,
  SIZE_17,
  SIZE_6,
} from "../../constants/constants";
import { MediaLoadingIndicatorProps } from "../../constants/types";
import { AppIcon } from "./AppIcon";

export function MediaLoadingIndicator({
  loadMedia,
  onError,
  onLoad,
  posterUri,
}: MediaLoadingIndicatorProps) {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const loadHanlder = async () => {
      if (isLoading) {
        try {
          await loadMedia();
          onLoad();
        } catch (error) {
          setLoading(false);
          onError({
            code: NETWORK_ERROR_CODE,
            message: "cannot load media",
            reasons: {},
          });
        }
      }
    };

    loadHanlder();
  }, [isLoading]);

  const retryHandler = useCallback(() => {
    setLoading(true);
  }, []);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container]}
      exiting={FadeOut.duration(500)}
    >
      <Image
        resizeMode="cover"
        source={{ uri: posterUri }}
        style={styles.image}
        fadeDuration={0}
        blurRadius={10}
      />
      {isLoading ? (
        <View style={[styles.absolutePosition, styles.loadingCirle]} />
      ) : (
        <Pressable
          style={styles.absolutePosition}
          android_disableSound={true}
          hitSlop={SIZE_6}
          onPress={retryHandler}
        >
          <AppIcon name="undo" size="large" isBorderVisible />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  absolutePosition: {
    position: "absolute",
  },
  loadingCirle: {
    width: SIZE_17,
    height: SIZE_17,
    borderRadius: Math.round(SIZE_17 / 2),
    borderColor: COLOR_8,
    borderWidth: 2 * StyleSheet.hairlineWidth,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
