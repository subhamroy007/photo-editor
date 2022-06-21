import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageResizeMode,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from "react-native";
import {
  IMAGE_POST_CONTENT_HEIGHT,
  NETWORK_ERROR_CODE,
  SCREEN_WIDTH,
} from "../../../constants/constants";
import { AppErrorParams, MediaParams } from "../../../constants/types";
import { useMediaProcessor } from "../../../hooks/useMediaProcessor";

export type ImagePostBodyProps = {
  media: MediaParams[];
  load: boolean;
  onError: (error: AppErrorParams) => void;
  onLoad: () => void;
  onImageIndexChange: (index: number) => void;
  error: AppErrorParams | null;
};

export function ImagePostBody({
  media,
  onError,
  load,
  onImageIndexChange,
  onLoad,
  error,
}: ImagePostBodyProps) {
  const { deleteFile } = useMediaProcessor();

  const offset = useRef<Animated.Value>(new Animated.Value(0)).current;

  const onMomentumScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      onImageIndexChange(Math.round(x / SCREEN_WIDTH));
    },
    []
  );

  const loadMediaCallback = useCallback(async () => {
    try {
      await Promise.all(media.map((image) => Image.prefetch(image.uri)));

      onLoad();
    } catch (error) {
      onError({
        code: NETWORK_ERROR_CODE,
        message: "network error",
        reasons: {},
      });
    }
  }, []);

  useEffect(() => {
    if (load) {
      loadMediaCallback();
    }
  }, [load]);

  return (
    <Animated.ScrollView
      style={styles.list}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
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
      onMomentumScrollEnd={onMomentumScrollEnd}
    >
      {!error &&
        !load &&
        media.map((image, index) => {
          const animatedTranslation = offset.interpolate({
            inputRange: [
              index * SCREEN_WIDTH,
              (media.length - 1) * SCREEN_WIDTH,
            ],
            outputRange: [0, (media.length - 1 - index) * SCREEN_WIDTH],
            extrapolate: "clamp",
          });

          let resizeMode: ImageResizeMode = "stretch";

          if (
            image.width <= SCREEN_WIDTH &&
            image.height <= IMAGE_POST_CONTENT_HEIGHT
          ) {
            resizeMode = "center";
          } else if (
            image.width > SCREEN_WIDTH &&
            image.height > IMAGE_POST_CONTENT_HEIGHT &&
            image.height >= image.width
          ) {
            resizeMode = "cover";
          } else {
            resizeMode = "contain";
          }

          return (
            <Animated.View
              key={image.uri}
              style={{
                transform: [{ translateX: animatedTranslation }],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{ ...image, cache: "only-if-cached" }}
                style={styles.background}
                resizeMode="cover"
                fadeDuration={0}
                blurRadius={10}
              />
              {
                <Image
                  source={{ ...image, cache: "only-if-cached" }}
                  style={styles.image}
                  fadeDuration={0}
                  resizeMode={resizeMode}
                />
              }
            </Animated.View>
          );
        })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignSelf: "stretch",
  },
  image: {
    width: SCREEN_WIDTH,
    height: IMAGE_POST_CONTENT_HEIGHT,
  },
  background: {
    width: SCREEN_WIDTH,
    height: IMAGE_POST_CONTENT_HEIGHT,
    position: "absolute",
  },
});
