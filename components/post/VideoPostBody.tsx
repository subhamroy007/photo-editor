import { ResizeMode, Video } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { selectMuteState } from "../../api/global/appSelector";
import { globalStyles } from "../../constants/style";
import { MediaParams } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { PostFallbackContent } from "../utility/PostFallbackContent";

export type VideoPostBodyProps = {
  video: MediaParams;
  coverEncoded: string;
  onPositionChange: (position: number) => void;
  isFocused: boolean;
};

export function VideoPostBody({
  coverEncoded,
  video,
  onPositionChange,
  isFocused,
}: VideoPostBodyProps) {
  const [mediaState, setMediaState] = useState<"loading" | "error" | "ready">(
    "loading"
  );

  const videoRef = useRef<Video | null>(null);

  const isMuted = useStoreSelector(selectMuteState);

  const loadMedia = useCallback(async () => {
    try {
      setMediaState("loading");
      await videoRef.current?.loadAsync(
        { ...video, overrideFileExtensionAndroid: "mp4" },
        {
          isLooping: true,
          isMuted,
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

  let resizeMode: ResizeMode = ResizeMode.STRETCH;

  if (video.width > video.height) {
    resizeMode = ResizeMode.CONTAIN;
  } else {
    resizeMode = ResizeMode.COVER;
  }

  return (
    <>
      <Video
        ref={videoRef}
        style={[
          { width: "100%", height: "100%" },
          globalStyles.primaryDarkBackgroundColor,
        ]}
        resizeMode={resizeMode}
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
