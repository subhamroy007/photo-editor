import { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { SCREEN_WIDTH } from "../../../constants/constants";
import { ImageParams } from "../../../constants/types";
import { AppImage } from "../../utility/AppImage";
import { AppScalable } from "../../utility/AppScalable";

export type SelectedPhotoPreviewProps = {
  images: ImageParams[];
};

export function SelectedPhotoPreview({ images }: SelectedPhotoPreviewProps) {
  const offset = useRef<Animated.Value>(new Animated.Value(0)).current;

  return (
    <Animated.ScrollView
      horizontal={true}
      pagingEnabled={true}
      style={styles.list}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
      overScrollMode="never"
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: offset,
              },
            },
          },
        ],
        { useNativeDriver: true }
      )}
    >
      {images.map((image, index) => {
        const animatedTranslation = offset.interpolate({
          inputRange: [
            index * SCREEN_WIDTH,
            (images.length - 1) * SCREEN_WIDTH,
          ],
          outputRange: [0, (images.length - 1 - index) * SCREEN_WIDTH],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={image.uri}
            style={{ transform: [{ translateX: animatedTranslation }] }}
          >
            <AppScalable>
              <AppImage image={image} style="fullscreen" />
            </AppScalable>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "black",
  },
});
