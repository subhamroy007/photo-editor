import { Video } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectMuteState } from "../../api/global/appSelector";
import { MediaParams } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { PostFallbackContent } from "../utility/PostFallbackContent";

export type MomentsPostBodyProps = {
  video: MediaParams;
  coverEncoded: string;
  isFocused: boolean;
  onPositionChange: (position: number) => void;
};

export function MomentsPostBody({
  coverEncoded,
  video,
  isFocused,
  onPositionChange,
}: MomentsPostBodyProps) {
  const videoRef = useRef<Video | null>(null);

  const [mediaState, setMediaState] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  const isMuted = useStoreSelector(selectMuteState);

  const loadMedia = useCallback(async () => {
    try {
      setMediaState("loading");
      await videoRef.current?.loadAsync(
        { ...video, overrideFileExtensionAndroid: "mp4" },
        {
          isLooping: true,
          isMuted: isMuted,
          progressUpdateIntervalMillis: 1000,
          volume: 1,
          shouldPlay: false,
        }
      );

      videoRef.current?.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          onPositionChange(status.positionMillis!);
        }
      });

      setMediaState("ready");
    } catch (error) {
      setMediaState("error");
    }
  }, [isMuted]);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    videoRef.current?.setIsMutedAsync(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (mediaState === "ready" && isFocused) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isFocused, mediaState]);

  return (
    <>
      <Video
        ref={videoRef}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
      {mediaState !== "ready" && (
        <PostFallbackContent
          cover={coverEncoded}
          isError={mediaState === "error"}
          onRetry={loadMedia}
        />
      )}
    </>
  );
}
