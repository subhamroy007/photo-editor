import React, { useEffect } from "react";
import { Image, ImageResizeMode, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  IMAGE_ZOOM_RESET_DURATION_MS,
  IMAGE_BLUR_RADIUS,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { AppImageProps } from "../../constants/types";

export const AppImage = React.memo<AppImageProps>(
  ({ height, image, width, zoom, onZoomReset }) => {
    let resizeMode: ImageResizeMode = "stretch";

    if (image.width <= width && image.height <= height) {
      resizeMode = "center";
    } else if (
      image.width > width &&
      image.height > height &&
      image.height >= image.width
    ) {
      resizeMode = "cover";
    } else {
      resizeMode = "contain";
    }

    const zoomScale = useSharedValue(1);

    useEffect(() => {
      if (zoom) {
        zoomScale.value = withTiming(2, {
          duration: IMAGE_ZOOM_RESET_DURATION_MS,
          easing: Easing.linear,
        });
      }
    }, [zoom]);

    const translationXValue = useSharedValue(0);
    const translationXOffset = useSharedValue(0);

    const translationYValue = useSharedValue(0);
    const translationYOffset = useSharedValue(0);

    const dragGesture = Gesture.Pan()
      .enabled(zoom === true)
      .onUpdate(({ translationX, translationY }) => {
        const allowedXTranslation = Math.floor(
          (zoomScale.value - 1) * width * 0.25
        );
        const allowedYTranslation = Math.floor(
          (zoomScale.value - 1) * height * 0.25
        );

        translationXValue.value = Math.min(
          allowedXTranslation,
          Math.max(
            -allowedXTranslation,
            translationX + translationXOffset.value
          )
        );

        translationYValue.value = Math.min(
          allowedYTranslation,
          Math.max(
            -allowedYTranslation,
            translationY + translationYOffset.value
          )
        );
      })
      .onEnd(() => {
        translationXOffset.value = translationXValue.value;
        translationYOffset.value = translationYValue.value;
      });

    const tapGesture = Gesture.Tap()
      .enabled(zoom === true)
      .onStart(() => {
        translationXOffset.value = 0;
        translationYOffset.value = 0;
        zoomScale.value = withTiming(1, {
          duration: IMAGE_ZOOM_RESET_DURATION_MS,
          easing: Easing.linear,
        });
        translationXValue.value = withTiming(0, {
          duration: IMAGE_ZOOM_RESET_DURATION_MS,
          easing: Easing.linear,
        });
        translationYValue.value = withTiming(0, {
          duration: IMAGE_ZOOM_RESET_DURATION_MS,
          easing: Easing.linear,
        });
        if (onZoomReset) {
          runOnJS(onZoomReset)();
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
    }, []);

    const compositeGesture = Gesture.Exclusive(tapGesture, dragGesture);

    return (
      <GestureDetector gesture={compositeGesture}>
        <Animated.View
          style={[
            {
              width,
              height,
            },
            animatedStyle,
          ]}
        >
          <Image
            source={image}
            fadeDuration={0}
            blurRadius={IMAGE_BLUR_RADIUS}
            resizeMode="cover"
            style={[globalStyles.absolutePosition, styles.image]}
          />
          <Image
            source={image}
            fadeDuration={0}
            style={styles.image}
            resizeMode={resizeMode}
          />
        </Animated.View>
      </GestureDetector>
    );
  },
  () => {
    return true;
  }
);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
