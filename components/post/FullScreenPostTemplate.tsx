import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_10,
  COLOR_5,
  COLOR_6,
  COLOR_8,
  SIZE_12,
  SIZE_13,
  SIZE_20,
  SIZE_21,
  SIZE_25,
  SIZE_29,
  SIZE_30,
  SIZE_31,
  SIZE_4,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  AppErrorParams,
  FullScreenPostTemplateProps,
} from "../../constants/types";
import { getCountString } from "../../constants/utility";
import { useDoubleTapPopupGesture } from "../../hooks/useDoubleTapPopupGesture";
import { AppAvatar } from "../utility/AppAvatar";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { AppText } from "../utility/AppText";
import { MediaLoadingIndicator } from "../utility/MediaLoadingIndicator";

export function FullScreenPostTemplate({
  externalGesture,
  hideDetails,
  index,
  isVisible,
  onAccountPress,
  onAuthorIdPress,
  onBookmarkPress,
  onCommentPress,
  onEffectButtonPress,
  onFollowButtonPress,
  onHashtagPress,
  onLikeCountPress,
  onLikePress,
  onLocationPress,
  onMoreIconPress,
  onMusicButtonPress,
  onSharePress,
  onTagIconPress,
  toggleFullScreen,
  post: {
    author,
    caption,
    effect,
    isLiked,
    isSaved,
    audio,
    noOfComments,
    noOfLikes,
    noOfViews,
    poster,
    taggedAccounts,
    taggedLocation,
    title,
    type,
    media,
  },
  isFullScreen,
  showFollowButton,
  loadMedia,
  height,
  width,
  children,
  isReady,
  onLoad,
  topNode,
  notify,
}: FullScreenPostTemplateProps) {
  const [isCaptionExpanded, setCaptionExpanded] = useState(false);

  const [captionHeigth, setCaptionHeigth] = useState(Math.floor(SIZE_25 * 1.3));

  const switchCaptionExpandedState = useCallback(() => {
    setCaptionExpanded((prevState) => !prevState);
  }, []);

  const errorHandler = useCallback(({ message }: AppErrorParams) => {
    notify(message);
  }, []);

  const shareIconPressHandler = useCallback(() => {
    onSharePress(index);
  }, [index]);

  const commentPressHandler = useCallback(() => {
    onCommentPress(index);
  }, [index]);

  const likeIconPressHandler = useCallback(() => {
    onLikePress(index);
  }, [index]);

  const likeCountPressHandler = useCallback(() => {
    onLikeCountPress(index);
  }, [index]);

  const bookmarkIconPressHandler = useCallback(() => {
    onBookmarkPress(index);
  }, [index]);

  const moreIconPressHandler = useCallback(() => {
    onMoreIconPress(index);
  }, [index]);

  const musicPressHandler = useCallback(() => {
    if (audio?.isAvailable) {
      onMusicButtonPress(index);
    } else {
      notify("music is not available");
    }
  }, [index]);

  const effectPressHandler = useCallback(() => {
    onEffectButtonPress(index);
  }, [index]);

  const authorIdPressHandler = useCallback(() => {
    onAuthorIdPress(index);
  }, [index]);

  const followButotnPressHandler = useCallback(() => {
    onFollowButtonPress(index);
  }, [index]);

  const captionPressHandler = useCallback((phase: string) => {
    if (phase.startsWith("@")) {
      onAccountPress(phase);
    } else if (phase.startsWith("#")) {
      onHashtagPress("#");
    } else {
      switchCaptionExpandedState();
    }
  }, []);

  const fullscreenIconPressHandler = useCallback(() => {
    if (media[0].width > media[0].height) {
      toggleFullScreen("landscape");
    } else {
      toggleFullScreen("portrait");
    }
  }, []);

  const captionHeightChangeHandler = useCallback(
    (_: number, height: number) => {
      setCaptionHeigth(height);
    },
    []
  );

  const doubleTapHandler = useCallback(() => {
    onLikePress(index, true);
  }, [index]);

  const { animatedStyle: animatedPopupStyle, doubleTapGesture } =
    useDoubleTapPopupGesture(
      doubleTapHandler,
      isReady && !hideDetails && isVisible
    );

  const compositeGesture = Gesture.Exclusive(doubleTapGesture, externalGesture);

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(hideDetails ? 0 : 1, {
        duration: 400,
        easing: Easing.linear,
      }),
    };
  }, [hideDetails]);

  const coverAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isCaptionExpanded ? 1 : 0, {
        duration: 400,
        easing: Easing.linear,
      }),
    };
  }, [isCaptionExpanded]);

  return (
    <Animated.View
      style={[
        { width, height },
        globalStyles.alignCenter,
        globalStyles.justifyCenter,
      ]}
    >
      <GestureDetector gesture={compositeGesture}>
        <Animated.View
          style={[
            globalStyles.alignCenter,
            globalStyles.justifyCenter,
            globalStyles.flex1,
            globalStyles.stretchSelf,
          ]}
        >
          {children}
          {!isFullScreen && (
            <Animated.View
              style={[globalStyles.absolutePosition, animatedPopupStyle]}
            >
              <AppIcon
                name="heart-solid"
                size="large"
                isBackgroundVisible
                background={"rgba(0, 0, 0, 0.7)"}
                foreground={COLOR_8}
              />
            </Animated.View>
          )}
          {!isReady && (
            <MediaLoadingIndicator
              loadMedia={loadMedia}
              onError={errorHandler}
              onLoad={onLoad}
              posterUri={poster}
            />
          )}
          {!isFullScreen && (
            <Animated.View
              style={[StyleSheet.absoluteFill, overlayAnimatedStyle]}
            >
              <AppPressable
                disabled={!isCaptionExpanded}
                styleProp={[
                  StyleSheet.absoluteFill,
                  coverAnimatedStyle,
                  { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                ]}
                onPress={switchCaptionExpandedState}
              ></AppPressable>
              <View
                style={[
                  globalStyles.absolutePosition,
                  styles.topAlignedContent,
                  globalStyles.alignCenter,
                  globalStyles.justifyCenter,
                  { width },
                ]}
              >
                {topNode}
              </View>
              {/* render the icons for like comment share etc */}
              <View
                style={[
                  globalStyles.absolutePosition,
                  styles.rightAlignedContent,
                  globalStyles.alignCenter,
                  {
                    width: Math.floor(width / 6),
                  },
                ]}
              >
                <AppPressable onPress={shareIconPressHandler} hitslop={SIZE_6}>
                  <AppIcon name={"share-outline"} />
                </AppPressable>

                <AppPressable
                  onPress={commentPressHandler}
                  hitslop={SIZE_6}
                  styleProp={[styles.topMarginMedium]}
                >
                  <AppIcon name={"comment-outline"} />
                  {noOfComments > 0 && (
                    <AppLabel
                      text={getCountString(noOfComments)}
                      styleProp={styles.topMarginSmall}
                      style="regular"
                    />
                  )}
                </AppPressable>

                <View
                  style={[
                    styles.topMarginMedium,
                    globalStyles.alignCenter,
                    globalStyles.justifyCenter,
                  ]}
                >
                  <AppPressable onPress={likeIconPressHandler} hitslop={SIZE_6}>
                    <AppIcon
                      name={isLiked ? "heart-solid" : "heart-outline"}
                      foreground={isLiked ? COLOR_10 : COLOR_8}
                    />
                  </AppPressable>
                  {noOfLikes > 0 && (
                    <AppPressable
                      styleProp={styles.topMarginSmall}
                      onPress={likeCountPressHandler}
                      hitslop={SIZE_6}
                    >
                      <AppLabel
                        text={getCountString(noOfLikes)}
                        style="regular"
                      />
                    </AppPressable>
                  )}
                </View>

                <AppPressable
                  onPress={bookmarkIconPressHandler}
                  hitslop={SIZE_6}
                  styleProp={styles.topMarginExtraLarge}
                >
                  <AppIcon
                    name={isSaved ? "bookmark-solid" : "bookmark-outline"}
                  />
                </AppPressable>

                <AppPressable
                  styleProp={styles.topMarginLarge}
                  onPress={moreIconPressHandler}
                  hitslop={SIZE_6}
                >
                  <AppIcon name={"more"} size="small" />
                </AppPressable>

                {audio && (
                  <AppPressable
                    styleProp={styles.topMarginLarge}
                    onPress={musicPressHandler}
                    hitslop={SIZE_6}
                  >
                    {audio.isAvailable ? (
                      <Image
                        source={{ uri: audio.poster }}
                        resizeMode="cover"
                        style={[styles.musicPoster]}
                        fadeDuration={0}
                      />
                    ) : (
                      <View
                        style={[
                          styles.musicPoster,
                          globalStyles.alignCenter,
                          globalStyles.justifyCenter,
                        ]}
                      >
                        <AppIcon name="music" size="small" />
                      </View>
                    )}
                  </AppPressable>
                )}

                {type === "video" && (
                  <AppPressable
                    hitslop={SIZE_6}
                    styleProp={styles.topMarginLarge}
                    onPress={fullscreenIconPressHandler}
                  >
                    <AppIcon
                      name="maximize"
                      isBorderVisible
                      size="extra-small"
                    />
                  </AppPressable>
                )}
              </View>
              {/* render the metadata of the post caption, author info etc */}
              <Animated.View
                style={[
                  globalStyles.absolutePosition,
                  styles.leftAlignedContent,
                  {
                    width: Math.floor((width * 5) / 6),
                  },
                ]}
                layout={Layout.duration(400)}
              >
                {effect && (
                  <AppPressable
                    styleProp={[
                      styles.bottomMarginSmall,
                      styles.effectContainer,
                      globalStyles.flexRow,
                      globalStyles.justifyCenter,
                    ]}
                    hitslop={SIZE_6}
                    onPress={effectPressHandler}
                  >
                    <AppIcon name="filter" size="extra-small" />
                    <AppLabel
                      size="extra-small"
                      text={effect.title}
                      style="regular"
                      styleProp={styles.leftMarginExtraSmall}
                    />
                  </AppPressable>
                )}

                {noOfViews > 0 && (
                  <AppLabel
                    text={noOfViews + " views"}
                    styleProp={styles.bottomMarginSmall}
                    style="regular"
                  />
                )}

                <View
                  style={[
                    globalStyles.flexRow,
                    globalStyles.alignCenter,
                    globalStyles.justifyCenter,
                  ]}
                >
                  <AppPressable onPress={authorIdPressHandler} hitslop={SIZE_6}>
                    <AppAvatar size="small" uri={author.profilePictureUri} />
                  </AppPressable>

                  <AppPressable
                    hitslop={SIZE_6}
                    onPress={authorIdPressHandler}
                    styleProp={[
                      styles.leftMarginSmall,
                      styles.authorIdContainer,
                    ]}
                  >
                    <AppLabel text={author.userId} />
                  </AppPressable>

                  {showFollowButton && (
                    <AppPressable
                      onPress={followButotnPressHandler}
                      styleProp={styles.leftMarginSmall}
                      hitslop={SIZE_6}
                    >
                      <AppLabel
                        text={author.isFollowing ? "unfollow" : "follow"}
                        isBorderVisible
                        corner="small-round"
                        gap="small"
                      />
                    </AppPressable>
                  )}
                </View>

                {/* render caption if available */}
                {caption.length > 0 && (
                  <ScrollView
                    style={[
                      styles.topMarginSmall,
                      {
                        maxHeight: Math.min(
                          captionHeigth,
                          10 * Math.floor(SIZE_25 * 1.3)
                        ),
                      },
                    ]}
                    overScrollMode="never"
                    onContentSizeChange={captionHeightChangeHandler}
                  >
                    <AppText
                      noOfLines={isCaptionExpanded ? 2000 : 1}
                      foreground={COLOR_8}
                      highlight={COLOR_6}
                      text={caption}
                      onPress={captionPressHandler}
                    />
                  </ScrollView>
                )}
              </Animated.View>
              {/* render the tagged account and location if any*/}
              {(taggedLocation || taggedAccounts.length > 0) && (
                <View
                  style={[
                    globalStyles.absolutePosition,
                    styles.bottomAlignedContent,
                    globalStyles.flexRow,
                    {
                      width,
                    },
                  ]}
                >
                  {taggedLocation && (
                    <AppPressable
                      onPress={() => {
                        onLocationPress(index);
                      }}
                      styleProp={[
                        globalStyles.flexRow,
                        globalStyles.alignCenter,
                        styles.tagContainer,
                      ]}
                      hitslop={SIZE_6}
                    >
                      <AppIcon name="location" size="small" />
                      <AppLabel
                        text={taggedLocation.title}
                        styleProp={styles.leftMarginSmall}
                        style="regular"
                      />
                    </AppPressable>
                  )}
                  {taggedAccounts.length > 0 && (
                    <AppPressable
                      onPress={() => {
                        onTagIconPress(index);
                      }}
                      styleProp={[
                        globalStyles.flexRow,
                        globalStyles.alignCenter,
                        styles.tagContainer,
                      ]}
                      hitslop={SIZE_6}
                    >
                      <AppIcon name="tag-bold" size="small" />
                      <AppLabel
                        text={
                          taggedAccounts.length === 1
                            ? taggedAccounts[0].userId
                            : taggedAccounts.length + " people"
                        }
                        style="regular"
                        styleProp={styles.leftMarginSmall}
                      />
                    </AppPressable>
                  )}
                </View>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  topAlignedContent: {
    top: 0,
    padding: SIZE_5,
  },
  rightAlignedContent: {
    right: 0,
    bottom: SIZE_13,
    paddingVertical: SIZE_5,
  },
  leftAlignedContent: {
    left: 0,
    bottom: SIZE_13,
    alignItems: "flex-start",
    padding: SIZE_5,
  },
  bottomAlignedContent: {
    bottom: 0,
    height: SIZE_13,
  },
  tagContainer: {
    paddingHorizontal: SIZE_4,
    width: "50%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
  },
  topMarginSmall: {
    marginTop: SIZE_4,
  },
  topMarginMedium: {
    marginTop: SIZE_9,
  },
  topMarginLarge: {
    marginTop: SIZE_12,
  },
  topMarginExtraLarge: {
    marginTop: SIZE_20,
  },
  leftMarginSmall: {
    marginLeft: SIZE_4,
  },
  leftMarginExtraSmall: {
    marginLeft: 4 * StyleSheet.hairlineWidth,
  },
  leftMarginLarge: {
    marginLeft: SIZE_12,
  },
  bottomMarginSmall: {
    marginBottom: SIZE_4,
  },
  musicPoster: {
    width: SIZE_13,
    height: SIZE_13,
    backgroundColor: COLOR_5,
    borderWidth: 4 * StyleSheet.hairlineWidth,
    borderColor: COLOR_8,
    borderRadius: SIZE_4,
  },
  effectContainer: {
    borderRadius: SIZE_5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  authorIdContainer: {
    maxWidth: SIZE_29,
  },
});
