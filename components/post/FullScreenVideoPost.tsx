import { Video } from "expo-av";
import { PitchCorrectionQuality } from "expo-av/build/AV.types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_1,
  COLOR_7,
  SIZE_1,
  SIZE_12,
  SIZE_16,
  SIZE_17,
  SIZE_20,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../constants/constants";
import { FullScreenVideoPostProps } from "../../constants/types";
import { getDurationString } from "../../constants/utility";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { FullScreenPostTemplate } from "./FullScreenPostTemplate";

export const FullScreenVideoPost = React.memo<FullScreenVideoPostProps>(
  ({ height, width, startFrom, isMuted, toggleMuteState, ...restProps }) => {
    const {
      post: { media, duration, title },
      isVisible,
      toggleFullScreen,
      isFullScreen,
    } = restProps;

    const videoRef = useRef<Video | null>(null);

    const [isReady, setReady] = useState(false);

    const [isPlaying, setPlaying] = useState(false);

    const [position, setPosition] = useState(0);

    const [isStopped, setStopped] = useState(false);

    const [showControls, setShowControls] = useState(false);

    const [hideDetails, setHideDetails] = useState(false);

    useEffect(() => {
      if (isFullScreen) {
        setHideDetails(true);
        setShowControls(true);
      } else {
        setHideDetails(false);
        setShowControls(true);
      }
    }, [isFullScreen]);

    //90% of the width will be covered by the bottom aligned controls container
    const bottomAlignedControlsContainerWidth = Math.round(width * 0.9);

    //80% of the bottom controls width will be used by the progress bar;
    const progressBarWidth = Math.round(
      bottomAlignedControlsContainerWidth * 0.8
    );

    //calculate the postion of the progressbar thumbnail and the width of the progressbar completed section
    const progressBarCompletedSectionWidth = Math.round(
      (progressBarWidth * position) / duration
    );

    //derive the time remaining string from the position
    const timeRemaining = getDurationString(duration - position);

    //enable the ready flag when media is loaded
    const mediaLoadHandler = useCallback(() => {
      setReady(true);
    }, []);

    //load the video while mounting the component
    const loadMedia = useCallback(async () => {
      if (videoRef.current) {
        //load the video file and enable looping and set the position to the starting position from the prop and also mute the video
        await videoRef.current.loadAsync(
          { ...media[0], overrideFileExtensionAndroid: "mp4" },
          {
            isLooping: false,
            isMuted: false,
            positionMillis: startFrom,
            progressUpdateIntervalMillis: 1000,
            shouldCorrectPitch: true,
            volume: 1,
            pitchCorrectionQuality: PitchCorrectionQuality.High,
          }
        );

        videoRef.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setStopped(status.didJustFinish);
            setPosition(Math.max(0, Math.min(duration, status.positionMillis)));
            setPlaying(status.isPlaying);
          }
        });
      }
    }, []);

    //mute the video based on mute flag
    useEffect(() => {
      const prepare = async () => {
        if (videoRef.current) {
          await videoRef.current.setIsMutedAsync(isMuted);
        }
      };
      prepare();
    }, [isMuted]);

    //play or pause the video based on the ready and visible flag
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
    }, [isVisible, isReady]);

    //unload the video while unmounting
    useEffect(() => {
      return () => {
        if (videoRef.current) {
          videoRef.current.unloadAsync();
        }
      };
    }, []);

    const tapHandler = useCallback(async () => {
      if (videoRef.current) {
        if (isFullScreen) {
          setShowControls((prevState) => !prevState);
        } else {
          toggleMuteState();
        }
      }
    }, [isFullScreen]);

    const tapGesture = Gesture.Tap()
      .enabled(isReady && isVisible)
      .onStart(tapHandler)
      .maxDuration(400);

    const longPressHandler = useCallback(async () => {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
        setHideDetails((prevState) => !prevState);
      }
    }, [isPlaying]);

    const longPressGesture = Gesture.LongPress()
      .onStart(longPressHandler)
      .onEnd(longPressHandler)
      .enabled(isReady && isVisible && !isFullScreen)
      .minDuration(400);

    const compositeGesture = Gesture.Exclusive(tapGesture, longPressGesture);

    //callback to play pause or replay the video based on isPlaying and isStopped flag
    const playPauseReplayIconPressHandler = useCallback(async () => {
      if (videoRef.current) {
        if (isStopped) {
          await videoRef.current.replayAsync();
        } else if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
      }
    }, [isStopped, isPlaying]);

    const fullscreenControlsOverlayAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(showControls ? 1 : 0, {
          duration: 400,
          easing: Easing.linear,
        }),
      };
    }, [showControls]);

    const [isProgressBarDragging, setProgressBarDragging] = useState(false);

    const progressBarOffset = useSharedValue(0);

    const progressBarDragStartHandler = useCallback(() => {
      setProgressBarDragging(true);
    }, [progressBarWidth]);

    const progressBarDragEndHandler = useCallback(
      async (offset: number) => {
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(
            Math.floor((offset * duration) / progressBarWidth)
          );
          setProgressBarDragging(false);
        }
      },
      [progressBarWidth]
    );

    const progressBarDragGesture = Gesture.Pan()
      .onStart(({ x }) => {
        progressBarOffset.value = Math.min(progressBarWidth, Math.max(0, x));
        runOnJS(progressBarDragStartHandler)();
      })
      .onUpdate(({ x }) => {
        progressBarOffset.value = Math.min(progressBarWidth, Math.max(0, x));
      })
      .onEnd(({ x }) => {
        progressBarOffset.value = Math.min(progressBarWidth, Math.max(0, x));
        runOnJS(progressBarDragEndHandler)(progressBarOffset.value);
      })
      .hitSlop({ top: SIZE_12, bottom: SIZE_12 });

    const animatedProgressBarStyle = useAnimatedStyle(() => {
      return {
        left: progressBarOffset.value - SIZE_6 / 2,
      };
    });

    const [decrementEnabled, setDecrementEnabled] = useState(false);
    const [incrementEnabled, setIncrementEnabled] = useState(false);

    const decrementAnimatedValue = useSharedValue(0);
    const incrementAnimatedValue = useSharedValue(0);

    const resetDecrementState = useCallback(() => {
      setDecrementEnabled(false);
    }, []);

    const resetIncrementState = useCallback(() => {
      setIncrementEnabled(false);
    }, []);

    const decrementContainerDoubleTapHandler = useCallback(async () => {
      if (videoRef.current) {
        cancelAnimation(decrementAnimatedValue);
        setDecrementEnabled(true);
        await videoRef.current.setPositionAsync(Math.max(0, position - 10_000));
        decrementAnimatedValue.value = 0.7;
        decrementAnimatedValue.value = withTiming(
          1,
          { duration: 400, easing: Easing.linear },
          (finished) => {
            if (finished) {
              decrementAnimatedValue.value = 0;
              runOnJS(resetDecrementState)();
            }
          }
        );
      }
    }, [position]);

    const decrementContainerTapHandler = useCallback(async () => {
      if (videoRef.current) {
        cancelAnimation(decrementAnimatedValue);
        await videoRef.current.setPositionAsync(Math.max(0, position - 10_000));
        decrementAnimatedValue.value = 0.7;
        decrementAnimatedValue.value = withTiming(
          1,
          { duration: 400, easing: Easing.linear },
          (finished) => {
            if (finished) {
              decrementAnimatedValue.value = 0;
              runOnJS(resetDecrementState)();
            }
          }
        );
      }
    }, [position]);

    const decrementContainerDoubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(decrementContainerDoubleTapHandler)
      .enabled(!decrementEnabled);

    const decrementContainerTapGesture = Gesture.Tap()
      .onStart(decrementContainerTapHandler)
      .enabled(decrementEnabled);

    const decrementContainerCompositeGesture = Gesture.Exclusive(
      decrementContainerDoubleTapGesture,
      decrementContainerTapGesture
    );

    const incrementContainerDoubleTapHandler = useCallback(async () => {
      if (videoRef.current) {
        cancelAnimation(incrementAnimatedValue);
        setIncrementEnabled(true);
        await videoRef.current.setPositionAsync(
          Math.min(position + 10_000, duration)
        );
        incrementAnimatedValue.value = 0.7;
        incrementAnimatedValue.value = withTiming(
          1,
          { duration: 400, easing: Easing.linear },
          (finished) => {
            if (finished) {
              incrementAnimatedValue.value = 0;
              runOnJS(resetIncrementState)();
            }
          }
        );
      }
    }, [position]);

    const incrementContainerTapHandler = useCallback(async () => {
      if (videoRef.current) {
        cancelAnimation(incrementAnimatedValue);
        await videoRef.current.setPositionAsync(
          Math.min(duration, position + 10_000)
        );
        incrementAnimatedValue.value = 0.7;
        incrementAnimatedValue.value = withTiming(
          1,
          { duration: 400, easing: Easing.linear },
          (finished) => {
            if (finished) {
              incrementAnimatedValue.value = 0;
              runOnJS(resetIncrementState)();
            }
          }
        );
      }
    }, [position]);

    const incrementContainerDoubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(incrementContainerDoubleTapHandler)
      .enabled(!incrementEnabled);

    const incrementContainerTapGesture = Gesture.Tap()
      .onStart(incrementContainerTapHandler)
      .enabled(incrementEnabled);

    const incrementContainerCompositeGesture = Gesture.Exclusive(
      incrementContainerDoubleTapGesture,
      incrementContainerTapGesture
    );

    const showControlsResetTimeOutId = useRef<NodeJS.Timeout | null>(null);

    const decrementContainerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: decrementAnimatedValue.value }],
      };
    });

    const incrementContainerAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: incrementAnimatedValue.value }],
      };
    });

    useEffect(() => {
      if (isStopped || isProgressBarDragging) {
        setShowControls(true);
      } else if (showControls) {
        showControlsResetTimeOutId.current = setTimeout(() => {
          setShowControls(false);
        }, 6000);
      }

      return () => {
        if (showControlsResetTimeOutId.current) {
          clearTimeout(showControlsResetTimeOutId.current);
        }
      };
    }, [
      showControls,
      isMuted,
      decrementEnabled,
      incrementEnabled,
      isPlaying,
      isStopped,
      isProgressBarDragging,
    ]);

    const fullscreenIconPressHandler = useCallback(async () => {
      if (videoRef.current) {
        if (media[0].width > media[0].height) {
          toggleFullScreen("landscape");
        } else {
          toggleFullScreen("portrait");
        }
        await videoRef.current.playAsync();
      }
    }, []);

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
          title.length > 0 && (
            <AppLabel
              size="medium"
              style="regular"
              text={title}
              noOfLines={2000}
            />
          )
        }
        {...restProps}
      >
        <Video
          resizeMode={isFullScreen ? "cover" : "contain"}
          ref={videoRef}
          style={styles.video}
        />
        {isFullScreen && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.alignItemCenter,
              styles.justifyCenter,
              fullscreenControlsOverlayAnimatedStyle,
            ]}
          >
            <AppPressable
              hitslop={SIZE_12}
              onPress={fullscreenIconPressHandler}
              styleProp={[
                styles.absolutePosition,
                {
                  top: width - bottomAlignedControlsContainerWidth,
                  left: (width - bottomAlignedControlsContainerWidth) / 2,
                },
              ]}
            >
              <AppIcon name="arrow-left" />
            </AppPressable>
            <AppPressable
              hitslop={SIZE_12}
              styleProp={styles.absolutePosition}
              onPress={playPauseReplayIconPressHandler}
            >
              {isStopped ? (
                <AppIcon name="undo" size="large" />
              ) : isPlaying ? (
                <AppIcon name="pause" size="large" />
              ) : (
                <AppIcon name="play" size="large" />
              )}
            </AppPressable>
            {/* bottom aligned controls */}
            <View
              style={[
                styles.absolutePosition,
                { width: bottomAlignedControlsContainerWidth },
                styles.bottomAlignedControls,
              ]}
            >
              {/* progress bar and timestamp container */}
              <View
                style={[
                  styles.stretchSelf,
                  styles.flexRow,
                  styles.alignItemCenter,
                  styles.justifyBetween,
                  styles.flex1,
                ]}
              >
                {/* progress bar to track and change the video position */}
                <GestureDetector gesture={progressBarDragGesture}>
                  <Animated.View
                    style={[
                      {
                        width: progressBarWidth,
                      },
                      styles.stretchSelf,
                      styles.justifyCenter,
                    ]}
                  >
                    <View style={[styles.durationBar, styles.stretchSelf]} />
                    <View
                      style={[
                        styles.absolutePosition,
                        {
                          width: progressBarCompletedSectionWidth,
                        },
                        styles.positionBar,
                      ]}
                    />
                    <Animated.View
                      style={[
                        styles.progressTracker,
                        styles.absolutePosition,
                        isProgressBarDragging
                          ? animatedProgressBarStyle
                          : {
                              left:
                                progressBarCompletedSectionWidth - SIZE_6 / 2,
                            },
                      ]}
                    />
                  </Animated.View>
                </GestureDetector>
                <AppLabel
                  text={timeRemaining}
                  size="extra-small"
                  style="regular"
                />
              </View>
              {/* playback controls */}
              <View
                style={[
                  styles.flexRow,
                  styles.alignItemCenter,
                  styles.justifyBetween,
                  styles.stretchSelf,
                  styles.flex1,
                ]}
              >
                <AppPressable hitslop={SIZE_12} onPress={toggleMuteState}>
                  {isMuted ? (
                    <AppIcon name="mute" />
                  ) : (
                    <AppIcon name="volume-high" />
                  )}
                </AppPressable>

                {/* prev and next icon container */}
                <View
                  style={[
                    styles.flexRow,
                    styles.justifyBetween,
                    styles.prevAndNextIconContainer,
                  ]}
                >
                  <AppPressable
                    hitslop={SIZE_12}
                    onPress={() => {
                      console.log("going to previous video");
                    }}
                  >
                    <AppIcon name="previous" />
                  </AppPressable>
                  <AppPressable
                    hitslop={SIZE_12}
                    onPress={() => {
                      console.log("going to next video");
                    }}
                  >
                    <AppIcon name="next" />
                  </AppPressable>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
        {isFullScreen && (
          <GestureDetector gesture={decrementContainerCompositeGesture}>
            <Animated.View
              style={[
                {
                  width: width * 0.4,
                  height: height * 0.6,
                  left: 0,
                },
                styles.absolutePosition,
                styles.justifyCenter,
                styles.alignItemCenter,
              ]}
            >
              <Animated.View style={decrementContainerAnimatedStyle}>
                <AppLabel text="-10" size="extra-large" style="regular" />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        )}
        {isFullScreen && (
          <GestureDetector gesture={incrementContainerCompositeGesture}>
            <Animated.View
              style={[
                {
                  width: width * 0.4,
                  height: height * 0.6,
                  right: 0,
                },
                styles.absolutePosition,
                styles.justifyCenter,
                styles.alignItemCenter,
              ]}
            >
              <Animated.View style={incrementContainerAnimatedStyle}>
                <AppLabel text="+10" size="extra-large" style="regular" />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        )}
      </FullScreenPostTemplate>
    );
  },
  () => {
    return false;
  }
);

const styles = StyleSheet.create({
  video: {
    width: "100%",
    height: "100%",
  },
  absolutePosition: {
    position: "absolute",
  },
  alignItemCenter: {
    alignItems: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  bottomAlignedControls: {
    bottom: SIZE_9,
    height: SIZE_17,
  },
  progressBarAndTimestampContainer: {
    height: SIZE_9,
  },
  stretchSelf: {
    alignSelf: "stretch",
  },
  durationBar: {
    height: 4 * StyleSheet.hairlineWidth,
    borderRadius: 4 * StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  positionBar: {
    height: 4 * StyleSheet.hairlineWidth,
    backgroundColor: COLOR_1,
    borderRadius: 4 * StyleSheet.hairlineWidth,
  },
  progressTracker: {
    width: SIZE_6,
    height: SIZE_6,
    borderRadius: SIZE_6 / 2,
    backgroundColor: COLOR_1,
  },
  prevAndNextIconContainer: {
    width: "40%",
  },
  flex1: {
    flex: 1,
  },
});
