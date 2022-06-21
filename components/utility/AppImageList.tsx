import { useCallback } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { AppImageListProps } from "../../constants/types";
import { AppImage } from "./AppImage";

export function AppImageList({
  media,
  height,
  width,
  onIndexChange,
  style,
  disabled,
  initialIndex,
  disableZoom,
  onPinchEnd,
  onPinchStart,
}: AppImageListProps) {
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset: { x } }) => {
      scrollOffset.value = x;
    },
  });

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onIndexChange) {
        onIndexChange(Math.floor(x / width));
      }
    },
    [width, onIndexChange]
  );

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      style={[{ maxHeight: height, maxWidth: width }, style]}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      onMomentumScrollEnd={onMomentumScrollEnd}
      contentOffset={{ y: 0, x: width * (initialIndex ? initialIndex : 0) }}
      overScrollMode="never"
      scrollEnabled={disabled !== true}
    >
      {media.map((image, index) => {
        return (
          <AppImage
            height={height}
            media={image}
            width={width}
            key={image.uri}
            disableZoom={disableZoom}
            onPinchEnd={onPinchEnd}
            onPinchStart={onPinchStart}
            offset={scrollOffset}
            scrollEnd={media.length - 1}
            scrollStart={index}
          />
        );
      })}
    </Animated.ScrollView>
  );
}
