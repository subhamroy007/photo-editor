import { useLayout } from "@react-native-community/hooks";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { globalStyles } from "../../constants/style";
import { AppImageListProps } from "../../constants/types";
import { AppImage } from "./AppImage";

export function AppImageList({
  images,
  onImageIndexChange,
  imageIndex,
  height,
  width,
  zoom,
}: AppImageListProps) {
  const scrollOffset = useRef<Animated.Value>(new Animated.Value(0)).current;

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        animated: false,
        x: imageIndex * width,
        y: 0,
      });
    }
  }, []);

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onImageIndexChange) {
        onImageIndexChange(x);
      }
    },
    []
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: scrollOffset,
              },
            },
          },
        ],
        { useNativeDriver: true }
      )}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      onMomentumScrollEnd={onMomentumScrollEnd}
      overScrollMode="never"
      scrollEnabled={zoom !== true}
    >
      {images.map((image, index) => {
        return (
          <Animated.View
            key={image.uri}
            style={{
              transform: [
                {
                  translateX: scrollOffset.interpolate({
                    inputRange: [index * width, (images.length - 1) * width],
                    outputRange: [0, (images.length - 1 - index) * width],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <AppImage
              height={height}
              width={width}
              image={image}
              zoom={zoom && imageIndex === index}
            />
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}
