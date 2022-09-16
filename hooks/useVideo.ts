import { Video } from "expo-av";
import { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import { MediaParams } from "../constants/types";

export function useVideo(
  video: MediaParams,
  ref: React.MutableRefObject<Video | null>
) {
  const [mediaState, setMediaState] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  const loadMedia = useCallback(async () => {
    try {
      setMediaState("loading");
      await ref.current?.loadAsync(
        { ...video, overrideFileExtensionAndroid: "mp4" },
        {
          volume: 1,
          shouldPlay: false,
        }
      );

      setMediaState("ready");
    } catch (error) {
      setMediaState("error");
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    loadMedia();
  }, []);

  return {
    state: mediaState,
    onRetry: loadMedia,
  };
}
