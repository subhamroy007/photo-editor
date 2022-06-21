import { Audio, Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import {
  COLOR_9,
  SHORTS_POST_CONTENT_HEIGHT,
  SIZE_4,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { FeedShortsPostProps } from "../../constants/types";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { SoundTrackAnimation } from "../utility/SoundTrackAnimation";
import { FeedPostTemplate } from "./FeedPostTemplate";

export const FeedShortsPost = React.memo<FeedShortsPostProps>(
  (props) => {
    const {
      post: { media, audio },
      notify,
      isMuted,
      isVisible,
      width,
      toggleMuteState,
      onMusicButtonPress,
      index,
    } = props;

    const videoRef = useRef<Video | null>(null);

    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const [isReady, setReady] = useState(false);

    const [isFinished, setFinished] = useState(false);

    //loop effect
    useEffect(() => {
      const prepare = async () => {
        if (isReady && isVisible && isFinished && videoRef.current) {
          await videoRef.current.playFromPositionAsync(0);
          if (sound) {
            await sound.playFromPositionAsync(audio!.startFrom);
          }
          setFinished(false);
        }
      };
      prepare();
    }, [isFinished, isReady, isVisible, sound]);

    //play-pause effect
    useEffect(() => {
      const prepare = async () => {
        if (videoRef.current && isReady) {
          if (isVisible) {
            await videoRef.current.playAsync();
            if (sound) {
              await sound.playAsync();
            }
          } else {
            await videoRef.current.pauseAsync();
            if (sound) {
              await sound.pauseAsync();
            }
          }
        }
      };
      prepare();
    }, [isReady, isVisible, sound]);

    //mute effect
    useEffect(() => {
      const prepare = async () => {
        if (sound) {
          await sound.setIsMutedAsync(isMuted);
        }
      };
      prepare();
    }, [isMuted, sound]);

    //unload video
    useEffect(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.unloadAsync();
        }
      };
    }, []);

    //unload audio
    useEffect(() => {
      return () => {
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [sound]);

    const loadAsync = useCallback(async () => {
      if (videoRef.current) {
        await videoRef.current.loadAsync(
          { ...media[0] },
          { isMuted: true, volume: 0 }
        );

        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setFinished(true);
            }
          }
        });

        if (audio) {
          if (audio.isAvailable) {
            const sound = await Audio.Sound.createAsync(
              { overrideFileExtensionAndroid: "mp3", uri: audio.uri },
              {
                isMuted,
                pitchCorrectionQuality: PitchCorrectionQuality.High,
                positionMillis: audio.startFrom,
                shouldCorrectPitch: true,
                volume: 1,
              }
            );
            setSound(sound.sound);
          } else {
            notify("this sound is not available");
          }
        } else {
          notify("this video has no sound");
        }
      }
    }, []);

    const loadHanlder = useCallback(() => {
      setReady(true);
    }, []);

    const musicLabelPressHandler = useCallback(() => {
      onMusicButtonPress(index);
    }, [index]);

    return (
      <FeedPostTemplate
        {...props}
        onLoad={loadHanlder}
        height={SHORTS_POST_CONTENT_HEIGHT}
        loadAsync={loadAsync}
      >
        <Video
          ref={videoRef}
          resizeMode="cover"
          style={{ height: SHORTS_POST_CONTENT_HEIGHT, width }}
        />
        {sound && (
          <>
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
            <AppPressable
              hitslop={SIZE_9}
              disabled={!isReady || !isVisible}
              onPress={musicLabelPressHandler}
              styleProp={[
                globalStyles.absolutePosition,
                globalStyles.flexRow,
                globalStyles.alignCenter,
                styles.musicLabel,
              ]}
            >
              <SoundTrackAnimation size="small" />
              <AppLabel
                text={audio!.title}
                style="regular"
                styleProp={styles.leftMarginSmall}
              />
            </AppPressable>
          </>
        )}
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
  musicLabel: {
    top: SIZE_5,
    left: SIZE_5,
  },
  leftMarginSmall: {
    marginLeft: SIZE_4,
  },
});
