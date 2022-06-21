import { Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  NETWORK_ERROR_CODE,
  SCREEN_WIDTH,
  SHORTS_POST_CONTENT_HEIGHT,
} from "../../../constants/constants";
import { AppErrorParams, MediaParams } from "../../../constants/types";

export type ShortsPostBodyProps = {
  media: MediaParams;
  play: boolean;
  mute: boolean;
  load: boolean;
  onError: (error: AppErrorParams) => void;
  onLoad: () => void;
  error: AppErrorParams | null;
  onPositionChange: (postiom: number) => void;
  onComplete: () => void;
  onRestart: () => void;
  complete: boolean;
};

export function ShortsPostBody({
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
}: ShortsPostBodyProps) {
  const [loopCount, setLoopCount] = useState(0);

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
            isMuted: false,
            pitchCorrectionQuality: PitchCorrectionQuality.High,
            progressUpdateIntervalMillis: 1000,
            shouldCorrectPitch: true,
            volume: 1,
            isLooping: true,
          }
        );
        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            onPositionChange(Math.max(status.positionMillis));
            if (status.didJustFinish) {
              setLoopCount((prevState) => prevState + 1);
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
        if (complete) {
          await videoRef.current.pauseAsync();
        } else {
          setLoopCount(0);
          await videoRef.current.setPositionAsync(0);
        }
      }
    };
    prepare();
  }, [load, error, complete]);

  useEffect(() => {
    if (loopCount === 2) {
      onComplete();
    }
  }, [loopCount]);

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
    height: SHORTS_POST_CONTENT_HEIGHT,
  },
});
