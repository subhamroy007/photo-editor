import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { NETWORK_ERROR_CODE, SIZE_9 } from "../../../constants/constants";
import { AppErrorParams, MediaParams } from "../../../constants/types";
import { AppImageList } from "../../utility/AppImageList";
import { AppLabel } from "../../utility/AppLabel";
import { AppScalable } from "../../utility/AppScalable";

export type ImagePostFullScreenBodyProps = {
  media: MediaParams[];
  isLoading: boolean;
  onError: (error: AppErrorParams) => void;
  onLoad: () => void;
  isReady: boolean;
  width: number;
  height: number;
  onTap: () => void;
  onPinchStart: (value: number) => void;
  onPinchEnd: (value: number) => void;
  isLabelVisible: boolean;
  isVisible: boolean;
};

export function ImagePostFullScreenBody({
  isLoading,
  isReady,
  media,
  onError,
  onLoad,
  height,
  width,
  onPinchEnd,
  onPinchStart,
  onTap,
  isVisible,
  isLabelVisible,
}: ImagePostFullScreenBodyProps) {
  const [index, setIndex] = useState(0);

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const loadMedia = useCallback(async () => {
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
    if (isLoading) {
      loadMedia();
    }
  }, [isLoading]);

  return (
    <>
      <AppScalable
        enabled={isReady && isVisible}
        styleProp={{ width, height }}
        onEnd={(value) => {
          if (value === 1) {
            setScrollEnabled(true);
          }
          onPinchEnd(value);
        }}
        onReset={() => {
          setScrollEnabled(true);
          onTap();
        }}
        onStart={(value) => {
          setScrollEnabled(false);
          onPinchStart(value);
        }}
      >
        {isReady && (
          <AppImageList
            height={height}
            media={media}
            onIndexChange={(index) => {
              setIndex(index);
            }}
            width={width}
            scrollEnabled={scrollEnabled}
          />
        )}
      </AppScalable>
      {isReady && media.length > 1 && !isLabelVisible && (
        <Animated.View
          style={styles.topLabel}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <AppLabel text={`${index + 1}/${media.length}`} />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  topLabel: {
    position: "absolute",
    top: SIZE_9,
  },
});
