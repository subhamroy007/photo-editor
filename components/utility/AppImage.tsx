import React, { useCallback, useState } from "react";
import { Image, ImageResizeMode, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  IMAGE_ZOOM_RESET_DURATION_MS,
  POSTER_BLUR_RADIUS,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { AppImageProps } from "../../constants/types";

export const AppImage = React.memo<AppImageProps>(
  ({
    media,
    height,
    width,
    style,
    disableZoom,
    onPinchEnd,
    onPinchStart,
    offset,
    scrollEnd,
    scrollStart,
  }) => {
    //calculate the resize mode of the image given the size of the container and the image itself
    let resizeMode: ImageResizeMode = "stretch";

    if (media.width <= width && media.height <= height) {
      resizeMode = "center";
    } else if (
      media.width > width &&
      media.height > height &&
      media.height >= media.width
    ) {
      resizeMode = "cover";
    } else {
      resizeMode = "contain";
    }

    const zoomScale = useSharedValue(1);
    const zoomOffset = useSharedValue(1);

    const translationXValue = useSharedValue(0);
    const translationXOffset = useSharedValue(0);

    const translationYValue = useSharedValue(0);
    const translationYOffset = useSharedValue(0);

    const [isDragEnabled, setDragEnabled] = useState(false);

    const pinchStartCallback = useCallback(
      (scale: number) => {
        setDragEnabled(true);
        if (onPinchStart) {
          onPinchStart(scale);
        }
      },
      [onPinchStart]
    );

    const pinchEndCallback = useCallback(
      (scale: number) => {
        if (scale === 1) {
          setDragEnabled(false);
        }
        if (onPinchEnd) {
          onPinchEnd(scale);
        }
      },
      [onPinchEnd]
    );

    const tapHandler = useCallback(() => {
      setDragEnabled(false);
      if (onPinchEnd) {
        onPinchEnd(0);
      }
    }, [onPinchEnd]);

    const dragGesture = Gesture.Pan()
      .enabled(isDragEnabled && disableZoom !== true)
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

    const pinchGesture = Gesture.Pinch()
      .enabled(disableZoom !== true)
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
      .enabled(disableZoom !== true && isDragEnabled)
      .onStart(() => {
        if (zoomScale.value !== 1) {
          zoomOffset.value = 1;
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
        }
        runOnJS(tapHandler)();
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: zoomScale.value,
          },
          {
            translateX:
              translationXValue.value +
              (scrollEnd !== undefined &&
              scrollStart !== undefined &&
              offset !== undefined
                ? interpolate(
                    offset.value,
                    [scrollStart * width, scrollEnd * width],
                    [0, (scrollEnd - scrollStart) * width],
                    Extrapolate.CLAMP
                  )
                : 0),
          },
          { translateY: translationYValue.value },
        ],
      };
    }, [scrollStart, scrollEnd, offset, width]);

    const compositeGesture = Gesture.Exclusive(
      tapGesture,
      Gesture.Simultaneous(dragGesture, pinchGesture)
    );

    return (
      <GestureDetector gesture={compositeGesture}>
        <Animated.View
          style={[
            {
              width,
              height,
            },
            style,
            animatedStyle,
          ]}
        >
          <Image
            source={media}
            fadeDuration={0}
            blurRadius={POSTER_BLUR_RADIUS}
            resizeMode="cover"
            style={[globalStyles.absolutePosition, styles.image]}
          />
          <Image
            source={media}
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
