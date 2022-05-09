import { Audio } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import { useCallback, useEffect, useRef, useState } from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

export type SoundHookState = {
  isLoading: boolean;
  hasError: boolean;
  isPlaying: boolean;
  isStopped: boolean;
  isReady: boolean;
};

export type SoundHookData = SoundHookState & {
  progress: SharedValue<number>;
  onPlay: (
    uri: string,
    lowerBound: number,
    upperBound: number,
    repeat: boolean
  ) => Promise<void>;
  onPause: () => Promise<void>;
  onStop: () => Promise<void>;
  selectedUri: string;
};

export function useSound(): SoundHookData {
  const sound = useRef<Audio.Sound>(new Audio.Sound());

  const progress = useSharedValue(0);

  const currentUri = useRef("");

  const [state, setState] = useState<SoundHookState>({
    hasError: false,
    isLoading: false,
    isPlaying: false,
    isStopped: false,
    isReady: false,
  });

  const reset = useCallback(async (error: boolean) => {
    await sound.current.unloadAsync();
    progress.value = 0;
    currentUri.current = "";
    setState({
      hasError: error,
      isStopped: false,
      isLoading: false,
      isPlaying: false,
      isReady: false,
    });
  }, []);

  const loadSound = useCallback(async (uri: string) => {
    currentUri.current = uri;
    setState((prevState) => ({ ...prevState, isLoading: true }));
    await sound.current.loadAsync(
      { uri, overrideFileExtensionAndroid: "mp3" },
      {
        isLooping: false,
        isMuted: false,
        pitchCorrectionQuality: PitchCorrectionQuality.High,
        progressUpdateIntervalMillis: 50,
        shouldPlay: false,
        shouldCorrectPitch: true,
        volume: 1,
      }
    );
    setState((prevState) => ({
      ...prevState,
      isLoading: false,
      isReady: true,
    }));
  }, []);

  const playSound = useCallback(
    async (
      uri: string,
      lowerBound: number,
      upperBound: number,
      repeat: boolean
    ) => {
      try {
        if (uri !== currentUri.current && uri !== "") {
          if (currentUri.current !== "") {
            await reset(false);
          }

          await loadSound(uri);
        }
        sound.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              if (repeat) {
                sound.current.playFromPositionAsync(lowerBound);
              } else {
                progress.value = 0;
                setState((prevState) => ({ ...prevState, hasStopped: true }));
              }
            } else {
              progress.value =
                (status.positionMillis! - lowerBound) /
                (upperBound - lowerBound);
              if (progress.value >= 1) {
                if (repeat) {
                  sound.current.playFromPositionAsync(lowerBound);
                } else {
                  progress.value = 0;
                  setState((prevState) => ({ ...prevState, hasStopped: true }));
                }
              }
            }
          }
        });
        await sound.current.playFromPositionAsync(lowerBound);
        setState((prevState) => ({
          ...prevState,
          isPlaying: true,
        }));
      } catch (error) {
        await reset(true);
      }
    },
    []
  );

  const pauseSound = useCallback(async () => {
    try {
      await sound.current.pauseAsync();
      setState((prevState) => ({ ...prevState, isPlaying: false }));
    } catch (error) {
      await reset(true);
    }
  }, []);

  const stopSound = useCallback(async () => {
    try {
      await sound.current.stopAsync();
      setState((prevState) => ({
        ...prevState,
        hasStopped: true,
        isPlaying: false,
      }));
    } catch (error) {
      await reset(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      reset(false);
    };
  }, []);

  return {
    onPlay: playSound,
    onPause: pauseSound,
    onStop: stopSound,
    ...state,
    progress,
    selectedUri: currentUri.current,
  };
}
