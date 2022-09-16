import { useCallback } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IMAGE_FADE_DURATION_MS,
  SCREEN_WIDTH,
} from "../../constants/constants";
import { MediaParams } from "../../constants/types";

export type ImageDeckProps = {
  images: MediaParams[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

export function ImageDeck({
  images,
  initialIndex,
  onIndexChange,
}: ImageDeckProps) {
  const { left, right } = useSafeAreaInsets();

  const bodyWidth = SCREEN_WIDTH - left - right;

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (onIndexChange) {
        onIndexChange(Math.round(x / bodyWidth));
      }
    },
    []
  );

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      nestedScrollEnabled
      overScrollMode={"never"}
      contentOffset={{
        x: bodyWidth * (initialIndex ? initialIndex : 0),
        y: 0,
      }}
    >
      {images.map((image) => (
        <Image
          fadeDuration={IMAGE_FADE_DURATION_MS}
          key={image.uri}
          source={image}
          resizeMode="cover"
          style={{
            width: bodyWidth,
            height: "100%",
          }}
        />
      ))}
    </ScrollView>
  );
}
