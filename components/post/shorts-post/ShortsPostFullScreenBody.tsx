import { Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { NETWORK_ERROR_CODE } from "../../../constants/constants";
import { AppErrorParams, MediaParams } from "../../../constants/types";

export type ShortsPostFullScreenBodyProps = {
  media: MediaParams;
  isLoading: boolean;
  onError: (error: AppErrorParams) => void;
  onLoad: () => void;
  isReady: boolean;
  width: number;
  height: number;
  isPaused: boolean;
  isVisible: boolean;
  isMuted: boolean;
  onLongPress: () => void;
};

export function ShortsPostFullScreenBody({
  height,
  isLoading,
  isPaused,
  isReady,
  isVisible,
  isMuted,
  media,
  onError,
  onLoad,
  width,
  onLongPress,
}: ShortsPostFullScreenBodyProps) {
  const videoRef = useRef<Video | null>(null);

  const loadMedia = useCallback(async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          {
            ...media,
            overrideFileExtensionAndroid: "mp4",
          },
          {
            isMuted,
            pitchCorrectionQuality: PitchCorrectionQuality.High,
            progressUpdateIntervalMillis: 1000,
            shouldCorrectPitch: true,
            volume: 1,
            isLooping: true,
          }
        );

        onLoad();
      }
    } catch (error) {
      onError({
        code: NETWORK_ERROR_CODE,
        message: "network error",
        reasons: {},
      });
    }
  }, []);

  const unloadMediaCallback = useCallback(async () => {
    if (videoRef.current) {
      await videoRef.current.unloadAsync();
    }
  }, []);

  //unload the video when unmounting
  useEffect(() => {
    return () => {
      unloadMediaCallback();
    };
  }, []);

  //load the media every time the loading flag changes to true
  useEffect(() => {
    if (isLoading) {
      loadMedia();
    }
  }, [isLoading]);

  //mute the video if the muted status is true else unmute it
  useEffect(() => {
    const prepare = async () => {
      if (isReady && videoRef.current) {
        await videoRef.current.setIsMutedAsync(isMuted);
      }
    };

    prepare();
  }, [isReady, isMuted]);

  //play the video if the post is visible and not paused else pause it
  useEffect(() => {
    const prepare = async () => {
      if (isReady && videoRef.current) {
        if (!isVisible || isPaused) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
      }
    };

    prepare();
  }, [isReady, isPaused]);

  const longPresGesture = Gesture.LongPress()
    .onStart(onLongPress)
    .enabled(isReady && isVisible);

  return (
    <GestureDetector gesture={longPresGesture}>
      <Animated.View style={{ width, height }}>
        <Video ref={videoRef} style={styles.video} resizeMode="cover" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  video: { width: "100%", height: "100%" },
});
