import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { Layout } from "react-native-reanimated";
import {
  COLOR_1,
  COLOR_10,
  COLOR_11,
  COLOR_6,
  COLOR_7,
  IMAGE_POST_CONTENT_HEIGHT,
  LONG_PRESS_DURATION_MS,
  SIZE_20,
  SIZE_21,
  SIZE_27,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { PostItemProps } from "../../constants/types";
import { getTimeElapsedString } from "../../constants/utility";
import { AppAvatar } from "../utility/AppAvatar";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppText } from "../utility/AppText";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FeedImagePostBody } from "./FeedImagePostBody";
import { useScaleUpAnimation } from "../../hooks/useScaleUpAnimation";
import { MediaLoadingComponent } from "../utility/MediaLoadingComponent";

export const FeedPostItem = React.memo<PostItemProps>(
  (props) => {
    const {
      width,
      notify,
      onLikeIconPress,
      isVisible,
      isMuted,
      isStoryLoading,
      onAccountIdPress,
      onAudioLabelPress,
      onAuthorAvatarPress,
      onAuthorFollowButtonPress,
      onCommentIconPress,
      onHashtagPress,
      onLikeCountPress,
      onLocationLabelPress,
      onMoreIconPress,
      onShareIconPress,
      onTagIconPress,
      showFollowButton,
      isCaptionExpanded,
      onCaptionPress,
      post: {
        poster,
        taggedAccounts,
        type,
        media,
        audio,
        author,
        caption,
        duration,
        isLiked,
        isSaved,
        noOfComments,
        noOfLikes,
        noOfViews,
        taggedLocation,
        timestamp,
        title,
        topLikes,
      },
    } = props;

    const [{ isError, isLoading, isReady }, setState] = useState<{
      isLoading: boolean;
      isReady: boolean;
      isError: boolean;
    }>({ isError: false, isLoading: true, isReady: false });

    const { scaleUpAnimationStyle, startScaleUpAnimation } =
      useScaleUpAnimation();

    const loadHandler = useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        isReady: true,
      }));
    }, []);

    const errorHandler = useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        isError: true,
        isLoading: false,
      }));
      notify("something went wrong");
    }, []);

    const retryHandler = useCallback(() => {
      setState((prevState) => ({
        ...prevState,
        isError: false,
        isLoading: true,
      }));
    }, []);

    const tapHandler = useCallback(() => {}, []);

    const doubleTapHandler = useCallback(() => {
      onLikeIconPress(true);
      startScaleUpAnimation();
    }, []);

    const longPressHandler = useCallback(() => {
      onMoreIconPress();
    }, []);

    const tapGesture = Gesture.Tap()
      .onStart(tapHandler)
      .maxDuration(LONG_PRESS_DURATION_MS)
      .enabled(isVisible && isReady);

    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onStart(doubleTapHandler)
      .enabled(isVisible && isReady);

    const longPressGesture = Gesture.LongPress()
      .onStart(longPressHandler)
      .minDuration(LONG_PRESS_DURATION_MS)
      .enabled(isVisible && isReady);

    const compositeGesture = Gesture.Exclusive(
      doubleTapGesture,
      tapGesture,
      longPressGesture
    );

    return (
      <Animated.View layout={Layout.duration(500)}>
        <View style={[globalStyles.flexRow, { height: SIZE_20 }]}>
          <Pressable
            android_disableSound
            style={[
              globalStyles.paddingHorizontalSize4,
              globalStyles.justifyCenter,
            ]}
            onPress={onAuthorAvatarPress}
          >
            <AppAvatar
              hasRing={author.hasUnseenStory}
              uri={author.profilePictureUri}
              isActive={author.hasUnseenStory}
              isAnimated={isStoryLoading}
            />
          </Pressable>
          <View style={[globalStyles.flex1, globalStyles.justifyCenter]}>
            <View style={[globalStyles.flexRow]}>
              <Pressable
                style={[
                  globalStyles.alignCenter,
                  globalStyles.justifyCenter,
                  { maxWidth: "75%" },
                ]}
                onPress={() => {
                  onAccountIdPress(author.userId);
                }}
              >
                <AppLabel text={author.userId} styleProp={{ width: "100%" }} />
              </Pressable>
              {showFollowButton && (
                <Pressable
                  style={[
                    globalStyles.alignCenter,
                    globalStyles.justifyCenter,
                    { marginHorizontal: 12 },
                  ]}
                  onPress={onAuthorFollowButtonPress}
                >
                  <AppLabel
                    text={author.isFollowing ? "following" : "follow"}
                    foreground={COLOR_1}
                    style="bold"
                  />
                </Pressable>
              )}
            </View>
            {(taggedLocation || taggedAccounts.length > 0) && (
              <View style={[globalStyles.flexRow, globalStyles.marginTopSize2]}>
                {taggedLocation && (
                  <Pressable
                    style={[
                      globalStyles.alignCenter,
                      globalStyles.justifyCenter,
                      globalStyles.flexRow,
                      { maxWidth: "50%" },
                    ]}
                    onPress={onLocationLabelPress}
                  >
                    <AppIcon name="location" size="extra-small" />
                    <AppLabel
                      text={taggedLocation.title}
                      style="regular"
                      styleProp={[globalStyles.marginLeftSize1]}
                    />
                  </Pressable>
                )}
                {taggedAccounts.length !== 0 && (
                  <Pressable
                    style={[
                      globalStyles.alignCenter,
                      globalStyles.justifyCenter,
                      globalStyles.flexRow,
                      globalStyles.marginLeftSize4,
                      { maxWidth: "50%" },
                    ]}
                    onPress={onTagIconPress}
                  >
                    <AppIcon name="tag-bold" size="extra-small" />
                    <AppLabel
                      text={
                        taggedAccounts.length === 1
                          ? taggedAccounts[0].userId
                          : taggedAccounts.length + " Accounts"
                      }
                      style="regular"
                      styleProp={globalStyles.marginLeftSize1}
                    />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </View>
        <GestureDetector gesture={compositeGesture}>
          <Animated.View
            style={[
              { height: IMAGE_POST_CONTENT_HEIGHT },
              globalStyles.justifyCenter,
            ]}
          >
            {type === "photo" && (
              <FeedImagePostBody
                images={media}
                isLoading={isLoading}
                isReady={isReady}
                isVisble={isVisible}
                onError={errorHandler}
                onLoad={loadHandler}
                width={width}
              />
            )}
            {isReady && (
              <Animated.View
                style={[
                  globalStyles.absolutePosition,
                  scaleUpAnimationStyle,
                  globalStyles.alignSelfCenter,
                ]}
              >
                <AppIcon
                  name="heart-solid"
                  background={COLOR_11}
                  isBackgroundVisible
                  size="large"
                  gap="medium"
                />
              </Animated.View>
            )}

            {!isReady && (
              <MediaLoadingComponent
                isError={isError}
                isLoading={isLoading}
                onRetry={retryHandler}
                poster={poster}
              />
            )}
          </Animated.View>
        </GestureDetector>
        {/* icons to interact with the post */}
        <View
          style={[
            globalStyles.justifyBetween,
            globalStyles.flexRow,
            { height: SIZE_21 },
          ]}
        >
          <View style={[globalStyles.flexRow, globalStyles.flex1]}>
            <Pressable
              android_disableSound
              onPress={() => {
                onLikeIconPress();
              }}
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.alignCenter,
                globalStyles.justifyCenter,
              ]}
            >
              <AppIcon
                name={isLiked ? "heart-solid" : "heart-outline"}
                foreground={isLiked ? COLOR_10 : COLOR_7}
              />
            </Pressable>
            <Pressable
              onPress={onCommentIconPress}
              android_disableSound
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.alignCenter,
                globalStyles.justifyCenter,
              ]}
            >
              <AppIcon name="comment-outline" />
            </Pressable>
            <Pressable
              onPress={onShareIconPress}
              android_disableSound
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.alignCenter,
                globalStyles.justifyCenter,
              ]}
            >
              <AppIcon name="share-outline" />
            </Pressable>
          </View>
          <Pressable
            onPress={onMoreIconPress}
            style={[
              globalStyles.paddingHorizontalSize4,
              globalStyles.alignCenter,
              globalStyles.justifyCenter,
            ]}
          >
            <AppIcon name="more" size="small" />
          </Pressable>
        </View>
        {/* render title if available */}
        {title !== "" && (
          <AppLabel
            text={title}
            size="medium"
            noOfLines={4}
            gapVertical="extra-small"
            gapHorizontal="large"
            alignment="left"
          />
        )}
        {/* render views if any */}
        {noOfViews > 0 && (
          <AppLabel
            text={noOfViews + " views"}
            gapVertical="small"
            gapHorizontal="large"
            alignment="left"
          />
        )}
        {/* render views count and top likes if any */}
        {noOfLikes > 0 &&
          (topLikes.length === 0 ? (
            <AppLabel
              text={noOfLikes === 1 ? "1 like" : noOfLikes + " likes"}
              gapVertical="extra-small"
              gapHorizontal="large"
              onPress={onLikeCountPress}
              alignment="left"
            />
          ) : (
            <Text
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.paddingVerticalSize1,
                {
                  textAlign: "left",
                },
              ]}
            >
              <AppLabel text="liked by " style="regular" noOfLines={2} />
              {topLikes.map((like) => (
                <AppLabel
                  text={like.userId + " "}
                  key={like.id}
                  onPress={() => {
                    onAccountIdPress(like.userId);
                  }}
                  noOfLines={2}
                />
              ))}
              {noOfLikes - topLikes.length > 0 && (
                <>
                  <AppLabel text="and " style="regular" noOfLines={2} />
                  <AppLabel
                    text={noOfLikes - topLikes.length + " other"}
                    onPress={onLikeCountPress}
                    noOfLines={2}
                  />
                </>
              )}
            </Text>
          ))}
        {/* render caption if available */}
        {caption !== "" && (
          <Text
            ellipsizeMode="tail"
            style={[
              globalStyles.paddingHorizontalSize4,
              globalStyles.paddingVerticalSize1,
              {
                textAlign: "left",
              },
            ]}
            numberOfLines={isCaptionExpanded ? 2000 : 2}
            onPress={onCaptionPress}
          >
            <AppLabel
              text={author.userId + " "}
              onPress={() => {
                onAccountIdPress(author.userId);
              }}
              noOfLines={2}
            />
            <AppText
              text={caption}
              onPress={(text: string) => {
                if (text.startsWith("@")) {
                  onAccountIdPress(text);
                } else if (text.startsWith("#")) {
                  onHashtagPress(text);
                } else {
                  onCaptionPress();
                }
              }}
              isExpanded={true}
            />
          </Text>
        )}
        {/* render no of comments if any */}
        {noOfComments > 0 && (
          <AppLabel
            text={
              "Show all " +
              (noOfComments > 2 ? noOfComments + " " : "") +
              "Comments"
            }
            foreground={COLOR_6}
            onPress={onCommentIconPress}
            gapHorizontal="large"
            gapVertical="small"
            alignment="left"
          />
        )}
        {/* show the comment box */}
        <Pressable
          style={[
            globalStyles.paddingHorizontalSize4,
            {
              height: SIZE_27,
            },
            globalStyles.flexRow,
            globalStyles.alignCenter,
          ]}
          onPress={onCommentIconPress}
        >
          <AppAvatar uri={author.profilePictureUri} size="small" />
          <AppLabel
            text="leave a comment..."
            foreground={COLOR_6}
            style="regular"
            size="small"
            styleProp={globalStyles.marginLeftSize4}
          />
        </Pressable>
        {/* show timestamp */}
        <AppLabel
          text={getTimeElapsedString(timestamp)}
          size="extra-small"
          foreground={COLOR_6}
          style="regular"
          gapHorizontal="large"
          gapVertical="small"
          styleProp={globalStyles.alignSelfStart}
        />
      </Animated.View>
    );
  },
  (prevState, nextState) => {
    return false;
  }
);
