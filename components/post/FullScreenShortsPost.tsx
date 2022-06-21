import { Audio, Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { SIZE_30, SIZE_4 } from "../../constants/constants";
import { FullScreenShortsPostProps } from "../../constants/types";
import { AppLabel } from "../utility/AppLabel";
import { SoundTrackAnimation } from "../utility/SoundTrackAnimation";
import { FullScreenPostTemplate } from "./FullScreenPostTemplate";

export const FullScreenShortsPost = React.memo<FullScreenShortsPostProps>(
  ({ height, width, startFrom, isMuted, onTap, ...restProps }) => {
    const {
      post: { media, music },
      notify,
      isVisible,
    } = restProps;

    const videoRef = useRef<Video | null>(null);

    const [audio, setAudio] = useState<Audio.Sound | null>(null);

    const [hideDetails, setHideDetails] = useState(false);

    const [isReady, setReady] = useState(false);

    const [isPlaying, setPlaying] = useState(true);

    const [replay, setReplay] = useState(false);

    const mediaLoadHandler = useCallback(() => {
      setReady(true);
    }, []);

    const loadMedia = useCallback(async () => {
      if (videoRef.current) {
        //load the video file and enable looping and set the position to the starting position from the prop and also mute the video
        await videoRef.current.loadAsync(
          { ...media[0], overrideFileExtensionAndroid: "mp4" },
          {
            isLooping: false,
            isMuted: true,
            positionMillis: startFrom,
            progressUpdateIntervalMillis: 1000,
            shouldCorrectPitch: true,
            volume: 1,
          }
        );

        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setReplay(true);
            }
          }
        });

        //if music available then load it and start from the appropriate postion based on clip position and video starting position
        if (music) {
          if (music.isAvailable) {
            const sound = await Audio.Sound.createAsync(
              { uri: music.uri, overrideFileExtensionAndroid: "mp3" },
              {
                isLooping: false,
                isMuted,
                pitchCorrectionQuality: PitchCorrectionQuality.High,
                positionMillis:
                  (startFrom % (music.clip[1] - music.clip[0])) + music.clip[0],
                progressUpdateIntervalMillis: 1000,
                shouldCorrectPitch: true,
                shouldPlay: false,
                volume: 1,
              }
            );

            setAudio(sound.sound);
          } else {
            notify("this audio is not available");
          }
        } else {
          notify("this video has no sound");
        }
      }
    }, []);

    useEffect(() => {
      const prepare = async () => {
        if (replay) {
          await videoRef.current?.playFromPositionAsync(0);
          if (audio) {
            await audio.playFromPositionAsync(music!.clip[0]);
          }
          setReplay(false);
        }
      };
      prepare();
    }, [replay, audio]);

    useEffect(() => {
      const prepare = async () => {
        if (audio) {
          await audio.setIsMutedAsync(isMuted);
        }
      };
      prepare();
    }, [isMuted, audio]);

    useEffect(() => {
      const prepare = async () => {
        if (videoRef.current && isReady) {
          if (isVisible && isPlaying) {
            await videoRef.current.playAsync();
            if (audio) {
              await audio.playAsync();
            }
          } else {
            await videoRef.current.pauseAsync();
            if (audio) {
              await audio.pauseAsync();
            }
          }
        }
      };
      prepare();
    }, [isVisible, isPlaying, isReady, audio]);

    useEffect(() => {
      return () => {
        if (audio) {
          audio.unloadAsync();
        }
      };
    }, [audio]);

    useEffect(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.unloadAsync();
        }
      };
    }, []);

    const togglePlayingState = useCallback(() => {
      console.log("toggling playins status");
      setPlaying((prevState) => !prevState);
      setHideDetails((prevState) => !prevState);
    }, []);

    const tapGesture = Gesture.Tap()
      .enabled(isReady && isVisible)
      .onStart(onTap)
      .maxDuration(400);

    const longPressGesture = Gesture.LongPress()
      .enabled(isReady && isVisible)
      .onStart(togglePlayingState)
      .onEnd(togglePlayingState)
      .minDuration(400);

    const compositeGesture = Gesture.Exclusive(tapGesture, longPressGesture);

    return (
      <FullScreenPostTemplate
        externalGesture={compositeGesture}
        height={height}
        hideDetails={hideDetails}
        isReady={isReady}
        loadMedia={loadMedia}
        onLoad={mediaLoadHandler}
        width={width}
        topNode={
          music &&
          music.isAvailable && (
            <View style={styles.container}>
              <SoundTrackAnimation size="small" />
              <AppLabel text={music.title} styleProp={styles.label} />
            </View>
          )
        }
        {...restProps}
      >
        <Video resizeMode="cover" ref={videoRef} style={styles.video} />
      </FullScreenPostTemplate>
    );
  },
  () => {
    return false;
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    maxWidth: SIZE_30,
  },
  label: {
    marginLeft: SIZE_4,
  },
  video: {
    width: "100%",
    height: "100%",
  },
});
