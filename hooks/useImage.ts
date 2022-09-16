import { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import { MediaParams } from "../constants/types";

export function useImage(images: MediaParams[]) {
  const [mediaState, setMediaState] = useState<"loading" | "error" | "ready">(
    "loading"
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

  return {
    state: mediaState,
    onRetry: loadMedia,
  };
}
