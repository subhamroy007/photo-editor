import { Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  COLOR_9,
  SIZE_9,
  VIDEO_POST_CONTENT_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { FeedVideoPostProps } from "../../constants/types";
import { AppIcon } from "../utility/AppIcon";
import { FeedPostTemplate } from "./FeedPostTemplate";

export const FeedVideoPost = React.memo<FeedVideoPostProps>(
  (props) => {
    const {
      toggleMuteState,
      isMuted,
      isVisible,
      width,
      post: { media },
    } = props;

    const [isReady, setReady] = useState(false);

    const videoRef = useRef<Video | null>(null);

    const loadHanlder = useCallback(() => {
      setReady(true);
    }, []);

    const loadAsync = useCallback(async () => {
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          { ...media[0], overrideFileExtensionAndroid: "mp4" },
          {
            isLooping: true,
            isMuted,
            pitchCorrectionQuality: PitchCorrectionQuality.High,
            shouldCorrectPitch: true,
            volume: 1,
          }
        );
      }
    }, []);

    useEffect(() => {
      const prepare = async () => {
        if (videoRef.current && isReady) {
          if (isVisible) {
            await videoRef.current.playAsync();
          } else {
            await videoRef.current.pauseAsync();
          }
        }
      };
      prepare();
    }, [isReady, isVisible]);

    useEffect(() => {
      const prepare = async () => {
        if (videoRef.current) {
          videoRef.current.setIsMutedAsync(isMuted);
        }
      };
      prepare();
    }, [isMuted]);

    useEffect(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.unloadAsync();
        }
      };
    }, []);

    return (
      <FeedPostTemplate
        {...props}
        onLoad={loadHanlder}
        height={VIDEO_POST_CONTENT_HEIGHT}
        loadAsync={loadAsync}
      >
        <Video
          ref={videoRef}
          resizeMode="cover"
          style={{ height: VIDEO_POST_CONTENT_HEIGHT, width }}
        />
        <AppPressable
          hitslop={SIZE_9}
          onPress={toggleMuteState}
          disabled={!isReady || !isVisible}
          styleProp={[globalStyles.absolutePosition, styles.muteIcon]}
        >
          <AppIcon
            name={isMuted ? "mute" : "volume-high"}
            size="extra-small"
            isBackgroundVisible
            background={COLOR_9}
          />
        </AppPressable>
      </FeedPostTemplate>
    );
  },
  () => {
    return false;
  }
);

const styles = StyleSheet.create({
  muteIcon: {
    bottom: SIZE_9,
    right: SIZE_9,
  },
});
