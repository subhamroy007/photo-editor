import { Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import {
  NETWORK_ERROR_CODE,
  SCREEN_WIDTH,
  VIDEO_POST_CONTENT_HEIGHT,
} from "../../../constants/constants";
import { AppErrorParams, MediaParams } from "../../../constants/types";

export type VideoPostBodyProps = {
  media: MediaParams;
  play: boolean;
  mute: boolean;
  load: boolean;
  preview: [number, number];
  onError: (error: AppErrorParams) => void;
  onLoad: () => void;
  error: AppErrorParams | null;
  onPositionChange: (postiom: number) => void;
  onComplete: () => void;
  onRestart: () => void;
  complete: boolean;
};

export function VideoPostBody({
  preview,
  media,
  onError,
  error,
  load,
  mute,
  onLoad,
  play,
  onPositionChange,
  onComplete,
  complete,
  onRestart,
}: VideoPostBodyProps) {
  const videoRef = useRef<Video | null>(null);

  const loadMediaCallback = useCallback(async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          {
            ...media,
            overrideFileExtensionAndroid: "mp4",
          },
          {
            positionMillis: preview[0],
            isMuted: false,
            pitchCorrectionQuality: PitchCorrectionQuality.High,
            progressUpdateIntervalMillis: 1000,
            shouldCorrectPitch: true,
            volume: 1,
            shouldPlay: true,
          }
        );
        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            onPositionChange(
              Math.max(preview[0], Math.min(preview[1], status.positionMillis))
            );
            if (status.didJustFinish || status.positionMillis >= preview[1]) {
              onComplete();
            }
          }
        });
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

  useEffect(() => {
    return () => {
      unloadMediaCallback();
    };
  }, []);

  useEffect(() => {
    if (load) {
      loadMediaCallback();
    }
  }, [load]);

  useEffect(() => {
    const prepare = async () => {
      if (!load && !error && videoRef.current) {
        if (complete) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.setPositionAsync(preview[0]);
        }
      }
    };

    prepare();
  }, [load, error, complete]);

  useEffect(() => {
    const prepare = async () => {
      if (!load && !error && videoRef.current) {
        await videoRef.current.setIsMutedAsync(mute);
      }
    };

    prepare();
  }, [load, error, mute]);

  useEffect(() => {
    const prepare = async () => {
      if (!load && !error && videoRef.current) {
        if (play) {
          await videoRef.current.playAsync();
        } else {
          onRestart();
          await videoRef.current.pauseAsync();
        }
      }
    };

    prepare();
  }, [load, error, play]);

  return (
    <Video
      ref={videoRef}
      useNativeControls={false}
      resizeMode="cover"
      style={styles.video}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: SCREEN_WIDTH,
    height: VIDEO_POST_CONTENT_HEIGHT,
  },
});
