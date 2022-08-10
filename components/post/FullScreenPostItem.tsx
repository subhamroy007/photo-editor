import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import { toggleAccountFollowing } from "../../api/accounts/accountSlice";
import { toggleMuteState } from "../../api/global/appSlice";
import { selectPostItem } from "../../api/post/postSelector";
import { togglePostLike } from "../../api/post/postSlice";
import {
  COLOR_10,
  COLOR_11,
  COLOR_8,
  LAYOUT_ANIMATION_DURATION_MS,
  SCREEN_HEIGHT,
  SIZE_12,
  SIZE_36,
  SIZE_5,
  SIZE_7,
  TAB_BAR_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  PostItemProps,
  RootBotttomTabsNavigationProp,
} from "../../constants/types";
import { getCountString, getDurationString } from "../../constants/utility";
import { useFadeAnimation } from "../../hooks/useFadeAnimation";
import { useScaleUpAnimation } from "../../hooks/useScaleUpAnimation";
import { useSpringAnimation } from "../../hooks/useSpringAnimation";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppAvatar } from "../utility/AppAvatar";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { HighlightedText } from "../utility/HighlightedText";
import { Poster } from "../utility/Poster";
import { ImagePostBody } from "./ImagePostBody";
import { MomentsPostBody } from "./MomentsPostBody";
import { VideoPostBody } from "./VideoPostBody";

export const FullScreenPostItem = React.memo<PostItemProps>(
  (props) => {
    const {
      isItemFocused,
      openCommentsShutter,
      openLikesShutter,
      openMoreOptionModal,
      openShareShutter,
      openTagsShuttrer,
      postId,
    } = props;

    const [isCaptionExpanded, setCaptionExpanded] = useState(false);

    const isScreenFocused = useIsFocused();

    const dispatch = useStoreDispatch();

    const navigation = useNavigation<RootBotttomTabsNavigationProp>();

    const [offsetOrPosition, setOffsetOrPosition] = useState(0);

    const { fadeAnimationStyle, startFadeAnimation } = useFadeAnimation(true);

    const { scaleUpAnimationStyle, startScaleUpAnimation } =
      useScaleUpAnimation();

    const { springAnimationStyle, startSpringAnimation } = useSpringAnimation();

    const [isPaused, setPaused] = useState(false);

    const getPost = useCallback((state) => selectPostItem(state, postId), []);

    const onOffsetOrPositionChange = useCallback(
      (value: number) => setOffsetOrPosition(value),
      []
    );

    const post = useStoreSelector(getPost, shallowEqual);

    const pressHandler = useCallback(() => {
      if (post.type !== "photo") {
        dispatch(toggleMuteState());
      }
    }, [post.type]);

    const showFollowButton = useRef(!post.author.isFollowing).current;

    const onLikeIconPress = useCallback((setToLike: boolean = false) => {
      dispatch(togglePostLike(postId, setToLike));
      startSpringAnimation();
    }, []);

    const onFollowButtonPress = useCallback(() => {
      dispatch(toggleAccountFollowing(post.author.id));
    }, [post.author]);

    const onDoubleTap = useCallback(() => {
      onLikeIconPress(true);
      startScaleUpAnimation();
    }, []);

    const onCommentIconPress = useCallback(() => {
      openCommentsShutter(postId);
    }, [postId]);

    const onMoreIconPress = useCallback(() => {
      openMoreOptionModal(postId);
    }, []);

    const navigateToAccount = useCallback(
      (userid: string) => {
        navigation.navigate("BottomTabs", {
          screen: "UtilityStacks",
          params: { screen: "Profile", params: { userid } },
        });
      },
      [navigation]
    );

    const onTagPress = useCallback(() => {
      if (typeof post.accounts === "string") {
        navigateToAccount(post.accounts);
      } else if (post.accounts !== 0) {
        openTagsShuttrer(postId);
      }
    }, [post.accounts, navigateToAccount]);

    const onLocationPress = useCallback(() => {
      if (post.location !== "") {
        navigation.navigate("BottomTabs", {
          screen: "UtilityStacks",
          params: { screen: "Location", params: { locationId: post.location } },
        });
      }
    }, [navigation, post.location]);

    const onAuthorIdPress = useCallback(() => {
      navigateToAccount(post.author.userid);
    }, [post.author, navigateToAccount]);

    const toggleCaptionExpandedState = useCallback(() => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(LAYOUT_ANIMATION_DURATION_MS, "linear", "scaleY")
      );
      setCaptionExpanded((prevState) => !prevState);
    }, [isCaptionExpanded]);

    const onLikeCountPress = useCallback(() => {
      startFadeAnimation(false);
      navigation.navigate("LikesScreen", { id: postId, type: "post" });
    }, [navigation, postId]);

    const onShareIconPress = useCallback(() => {
      openShareShutter(postId);
    }, []);

    const onAudioPress = useCallback(() => {
      navigation.navigate("BottomTabs", {
        screen: "UtilityStacks",
        params: {
          screen: "Audio",
          params: { audioId: post.moment!.audio!.id },
        },
      });
    }, [post.moment?.audio]);

    const onFilterPress = useCallback(() => {
      navigation.navigate("BottomTabs", {
        screen: "UtilityStacks",
        params: {
          screen: "Effect",
          params: { effectId: post.moment!.filter!.id },
        },
      });
    }, [post.moment?.filter]);

    const onMaximizeIconPress = useCallback(() => {
      console.log("going to fullscreen");
    }, []);

    const { top, bottom } = useSafeAreaInsets();

    let postHeight = SCREEN_HEIGHT - bottom;

    if (SCREEN_HEIGHT > 960) {
      postHeight = postHeight - top;
    }

    useFocusEffect(() => {
      startFadeAnimation(true);
    });

    return (
      <AppPressable
        onDoubleTap={onDoubleTap}
        onPress={pressHandler}
        style={[
          { height: postHeight },
          globalStyles.primaryDarkBackgroundColor,
          globalStyles.justifyCenter,
        ]}
        disabled={isCaptionExpanded}
      >
        {post.type === "video" && (
          <VideoPostBody
            coverEncoded={post.previewEncoded}
            onPositionChange={onOffsetOrPositionChange}
            isFocused={isItemFocused && isScreenFocused && !isPaused}
            video={post.video!.video}
          />
        )}
        {post.type === "moment" && (
          <MomentsPostBody
            coverEncoded={post.previewEncoded}
            onPositionChange={onOffsetOrPositionChange}
            isFocused={isItemFocused && isScreenFocused && !isPaused}
            video={post.moment!.video}
          />
        )}
        {post.type === "photo" && (
          <ImagePostBody
            images={post.photo!.photos}
            coverEncoded={post.previewEncoded}
            onOffsetChange={onOffsetOrPositionChange}
          />
        )}
        <Animated.View
          style={[
            globalStyles.absolutePosition,
            globalStyles.alignSelfCenter,
            scaleUpAnimationStyle,
          ]}
        >
          <AppIcon
            name="heart-solid"
            backgroundVisible
            background={COLOR_11}
            size="large"
            gap="medium"
          />
        </Animated.View>
        <Animated.View
          style={[
            globalStyles.absolutePosition,
            globalStyles.alignSelfCenter,
            globalStyles.alignCenter,
            globalStyles.paddingVerticalSize7,
            styles.topLabel,
            fadeAnimationStyle,
          ]}
        >
          {post.type === "photo" && (
            <AppLabel
              text={`${offsetOrPosition + 1}/${post.photo!.photos.length}`}
              size="medium"
              foreground={COLOR_8}
            />
          )}
          {post.type === "video" && (
            <AppLabel
              text={getDurationString(post.video!.duration - offsetOrPosition)}
              size="medium"
              foreground={COLOR_8}
            />
          )}
        </Animated.View>
        <Animated.View
          style={[
            globalStyles.absolutePosition,
            styles.rightContainer,
            globalStyles.alignCenter,
            globalStyles.paddingVerticalSize4,
            globalStyles.alignSelfEnd,
            fadeAnimationStyle,
          ]}
        >
          <View style={[globalStyles.alignCenter]}>
            <AppPressable
              onPress={onLikeIconPress}
              hitSlop={{
                left: SIZE_12,
                right: SIZE_12,
                bottom: SIZE_7,
                top: SIZE_5,
              }}
              animatedStyle={springAnimationStyle}
            >
              <AppIcon
                name={post.isLiked ? "heart-solid" : "heart-outline"}
                foreground={post.isLiked ? COLOR_10 : COLOR_8}
              />
            </AppPressable>
            {post.noOfLikes > 0 && (
              <Pressable
                android_disableSound
                style={globalStyles.marginTopSize3}
                onPress={onLikeCountPress}
                hitSlop={{
                  left: SIZE_12,
                  right: SIZE_12,
                  top: SIZE_7,
                  bottom: SIZE_5,
                }}
              >
                <AppLabel
                  text={getCountString(post.noOfLikes)}
                  foreground={COLOR_8}
                  style="regular"
                />
              </Pressable>
            )}
          </View>
          <Pressable
            android_disableSound
            onPress={onCommentIconPress}
            hitSlop={{
              left: SIZE_12,
              right: SIZE_12,
              bottom: SIZE_7,
              top: SIZE_5,
            }}
            style={[globalStyles.alignCenter, globalStyles.marginTopSize7]}
          >
            <AppIcon name="comment-outline" foreground={COLOR_8} />
            {post.noOfComments > 0 && (
              <AppLabel
                text={getCountString(post.noOfComments)}
                foreground={COLOR_8}
                style="regular"
                styleProp={globalStyles.marginTopSize3}
              />
            )}
          </Pressable>
          <Pressable
            android_disableSound
            onPress={onShareIconPress}
            hitSlop={{
              left: SIZE_12,
              right: SIZE_12,
              bottom: SIZE_7,
              top: SIZE_5,
            }}
            style={[globalStyles.alignCenter, globalStyles.marginTopSize7]}
          >
            <AppIcon name="share-outline" foreground={COLOR_8} />
          </Pressable>
          <Pressable
            android_disableSound
            onPress={onMoreIconPress}
            hitSlop={{
              left: SIZE_12,
              right: SIZE_12,
              bottom: SIZE_7,
              top: SIZE_5,
            }}
            style={[
              globalStyles.alignCenter,
              globalStyles.marginTopSize7,
              globalStyles.marginBottomSize7,
            ]}
          >
            <AppIcon name="info" foreground={COLOR_8} />
          </Pressable>
          {post.type === "moment" && post.moment?.audio && (
            <Pressable
              android_disableSound
              style={globalStyles.marginTopSize7}
              onPress={onAudioPress}
            >
              <Poster image={post.moment.audio.poster} />
            </Pressable>
          )}
          {post.type === "video" && (
            <Pressable
              android_disableSound
              style={globalStyles.marginTopSize7}
              onPress={onMaximizeIconPress}
            >
              <AppIcon
                name="maximize"
                gap="small"
                foreground={COLOR_8}
                borderVisible
              />
            </Pressable>
          )}
        </Animated.View>
        <Pressable
          style={[
            StyleSheet.absoluteFill,
            globalStyles.semiTransparentBackgroundColor2,
            {
              zIndex: isCaptionExpanded ? undefined : -100,
            },
          ]}
          onPress={toggleCaptionExpandedState}
        />
        <Animated.View
          style={[
            globalStyles.absolutePosition,
            globalStyles.alignSelfStart,
            globalStyles.paddingVerticalSize4,
            globalStyles.paddingHorizontalSize4,
            styles.bottomLabel,
            fadeAnimationStyle,
          ]}
        >
          {post.noOfViews > 0 && (
            <AppLabel
              text={getCountString(post.noOfViews) + " views"}
              foreground={COLOR_8}
              styleProp={[
                globalStyles.marginBottomSize4,
                globalStyles.alignSelfStart,
              ]}
            />
          )}
          {post.type === "video" && (
            <AppLabel
              text={post.video!.title}
              foreground={COLOR_8}
              noOfLines={4}
              style="bold"
              styleProp={[globalStyles.marginBottomSize4]}
            />
          )}
          <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
            <Pressable android_disableSound onPress={onAuthorIdPress}>
              <AppAvatar image={post.author.profilePicture} transparent />
            </Pressable>
            <Pressable
              style={[[globalStyles.marginLeftSize2, { maxWidth: "60%" }]]}
              android_disableSound
              onPress={onAuthorIdPress}
            >
              <AppLabel text={post.author.userid} foreground={COLOR_8} />
            </Pressable>
            {showFollowButton && (
              <Pressable
                style={globalStyles.marginLeftSize4}
                android_disableSound
                onPress={onFollowButtonPress}
              >
                <AppLabel
                  text={post.author.isFollowing ? "following" : "follow"}
                  foreground={COLOR_8}
                  size="extra-small"
                  style="bold"
                  borderVisible
                  gap="small"
                  corner="small-round"
                />
              </Pressable>
            )}
          </View>
          {post.caption !== "" && (
            <Pressable
              android_disableSound
              onPress={toggleCaptionExpandedState}
              style={[globalStyles.marginTopSize4, styles.caption]}
            >
              <ScrollView
                fadingEdgeLength={10}
                nestedScrollEnabled
                overScrollMode="never"
              >
                <HighlightedText
                  text={post.caption}
                  noOfLines={isCaptionExpanded ? undefined : 2}
                  transparent
                />
              </ScrollView>
            </Pressable>
          )}
          {(post.location !== "" || post.accounts !== 0) && (
            <View style={[globalStyles.marginTopSize4, globalStyles.flexRow]}>
              {post.location !== "" && (
                <Pressable
                  android_disableSound
                  onPress={onLocationPress}
                  style={[
                    globalStyles.flexRow,
                    globalStyles.flex1,
                    globalStyles.alignCenter,
                    globalStyles.marginRightSize4,
                  ]}
                >
                  <AppIcon
                    name="location"
                    size="extra-small"
                    foreground={COLOR_8}
                  />
                  <AppLabel
                    text={post.location}
                    style="regular"
                    styleProp={[
                      globalStyles.marginLeftSize1,
                      globalStyles.flex1,
                    ]}
                    alignment="left"
                    foreground={COLOR_8}
                  />
                </Pressable>
              )}
              {post.accounts !== 0 && (
                <Pressable
                  android_disableSound
                  style={[
                    globalStyles.flexRow,
                    globalStyles.flex1,
                    globalStyles.alignCenter,
                  ]}
                  onPress={onTagPress}
                >
                  <AppIcon
                    name="tag-regular"
                    foreground={COLOR_8}
                    size="extra-small"
                  />
                  <AppLabel
                    text={
                      typeof post.accounts === "number"
                        ? post.accounts + " accounts"
                        : post.accounts
                    }
                    foreground={COLOR_8}
                    style="regular"
                    styleProp={[
                      globalStyles.marginLeftSize1,
                      globalStyles.flex1,
                    ]}
                    alignment="left"
                  />
                </Pressable>
              )}
            </View>
          )}
        </Animated.View>
      </AppPressable>
    );
  },
  () => true
);

const styles = StyleSheet.create({
  topLabel: {
    width: "70%",
    top: 0,
  },
  bottomLabel: {
    bottom: TAB_BAR_HEIGHT,
    width: "85%",
  },
  rightContainer: {
    bottom: TAB_BAR_HEIGHT,
    width: "15%",
  },
  caption: { maxHeight: SIZE_36 },
});
