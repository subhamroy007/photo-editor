import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IMAGE_FADE_DURATION_MS,
  SCREEN_WIDTH,
} from "../../constants/constants";
import { MediaParams } from "../../constants/types";
import { PostFallbackContent } from "../utility/PostFallbackContent";

export type ImagePostBodyProps = {
  images: MediaParams[];
  coverEncoded: string;
  onOffsetChange: (offset: number) => void;
};

export function ImagePostBody({
  images,
  coverEncoded,
  onOffsetChange,
}: ImagePostBodyProps) {
  const { left, right } = useSafeAreaInsets();

  const imageWidth = SCREEN_WIDTH - left - right;

  const scrollOffset = useRef<Animated.Value>(new Animated.Value(0)).current;

  const [mediaState, setMediaState] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      onOffsetChange(Math.floor(x / imageWidth));
    },
    []
  );

  const loadMedia = useCallback(async () => {
    try {
      setMediaState("loading");
      await Promise.all(images.map((image) => Image.prefetch(image.uri)));
      setMediaState("ready");
    } catch (error) {
      setMediaState("error");
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, []);

  return (
    <>
      {mediaState === "ready" ? (
        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollOffset } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={onMomentumScrollEnd}
          nestedScrollEnabled
          overScrollMode={"never"}
        >
          {images.map((image, imageIndex) => (
            <Animated.Image
              fadeDuration={IMAGE_FADE_DURATION_MS}
              key={image.uri}
              source={image}
              resizeMode="cover"
              style={{
                width: imageWidth,
                height: "100%",
                transform: [
                  {
                    translateX: scrollOffset.interpolate({
                      inputRange: [
                        imageIndex * imageWidth,
                        (images.length - 1) * imageWidth,
                      ],
                      outputRange: [
                        0,
                        (images.length - 1 - imageIndex) * imageWidth,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            />
          ))}
        </Animated.ScrollView>
      ) : (
        <PostFallbackContent
          cover={coverEncoded}
          isError={mediaState === "error"}
          onRetry={loadMedia}
        />
      )}
    </>
  );
}
