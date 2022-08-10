import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";
import { toggleAccountFollowing } from "../../api/accounts/accountSlice";
import {
  selectMuteState,
  selectProfilePicuture,
} from "../../api/global/appSelector";
import { toggleMuteState } from "../../api/global/appSlice";
import { selectPostItem } from "../../api/post/postSelector";
import { togglePostLike } from "../../api/post/postSlice";
import {
  COLOR_10,
  COLOR_11,
  COLOR_5,
  COLOR_7,
  COLOR_8,
  IMAGE_POST_CONTENT_HEIGHT,
  SCREEN_WIDTH,
  SHORTS_POST_CONTENT_HEIGHT,
  SIZE_12,
  SIZE_5,
  SIZE_6,
  SIZE_9,
  VIDEO_POST_CONTENT_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  PostItemProps,
  RootBotttomTabsNavigationProp,
} from "../../constants/types";
import {
  getCountString,
  getDurationString,
  getTimeElapsedString,
} from "../../constants/utility";
import { useScaleUpAnimation } from "../../hooks/useScaleUpAnimation";
import { useSpringAnimation } from "../../hooks/useSpringAnimation";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppAvatar } from "../utility/AppAvatar";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { HighlightedText } from "../utility/HighlightedText";
import { SoundTrackAnimation } from "../utility/SoundTrackAnimation";
import { ImagePostBody } from "./ImagePostBody";
import { MomentsPostBody } from "./MomentsPostBody";
import { VideoPostBody } from "./VideoPostBody";

export const FeedPostItem = React.memo<PostItemProps>(
  (props) => {
    const {
      openCommentsShutter,
      openLikesShutter,
      openMoreOptionModal,
      openTagsShuttrer,
      openShareShutter,
      postId,
      isItemFocused,
    } = props;

    const [isCaptionExpanded, setCaptionExpanded] = useState(false);

    const isScreenFocused = useIsFocused();

    const dispatch = useStoreDispatch();

    const navigation = useNavigation<RootBotttomTabsNavigationProp>();

    const { left, right } = useSafeAreaInsets();

    const [offsetOrPosition, setOffsetOrPosition] = useState(0);

    const profilePicture = useStoreSelector(
      selectProfilePicuture,
      shallowEqual
    );

    const { scaleUpAnimationStyle, startScaleUpAnimation } =
      useScaleUpAnimation();

    const { springAnimationStyle, startSpringAnimation } = useSpringAnimation();

    const getPost = useCallback((state) => selectPostItem(state, postId), []);

    const onOffsetOrPositionChange = useCallback(
      (value: number) => setOffsetOrPosition(value),
      []
    );

    const isMuted = useStoreSelector(selectMuteState);

    const post = useStoreSelector(getPost, shallowEqual);

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
        navigation.push("BottomTabs", {
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
        navigation.push("BottomTabs", {
          screen: "UtilityStacks",
          params: { screen: "Location", params: { locationId: post.location } },
        });
      }
    }, [navigation, post.location]);

    const onAuthorIdPress = useCallback(() => {
      navigateToAccount(post.author.userid);
    }, [post.author, navigateToAccount]);

    const onCaptionPress = useCallback(() => {
      if (isCaptionExpanded) {
        onCommentIconPress();
      } else {
        setCaptionExpanded(true);
      }
    }, [isCaptionExpanded]);

    const onLikeCountPress = useCallback(() => {
      openLikesShutter(postId);
    }, []);

    const onShareIconPress = useCallback(() => {
      openShareShutter(postId);
    }, []);

    const postHeight =
      post.type === "photo"
        ? IMAGE_POST_CONTENT_HEIGHT
        : post.type === "video"
        ? VIDEO_POST_CONTENT_HEIGHT
        : SHORTS_POST_CONTENT_HEIGHT;

    return (
      <View>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.paddingVerticalSize2,
            globalStyles.paddingHorizontalSize4,
            globalStyles.alignCenter,
          ]}
        >
          <AppAvatar
            image={post.author.profilePicture}
            hasRing={post.author.showStoryIndicator}
            isActive={post.author.showStoryIndicator}
          />
          <View
            style={[
              globalStyles.flex1,
              globalStyles.marginLeftSize4,
              globalStyles.alignStart,
            ]}
          >
            <Pressable android_disableSound onPress={onAuthorIdPress}>
              <AppLabel text={post.author.userid} />
            </Pressable>
            {(post.location !== "" || post.accounts !== 0) && (
              <View
                style={[
                  globalStyles.marginTopSize1,
                  globalStyles.flexRow,
                  globalStyles.stretchSelf,
                ]}
              >
                {post.location !== "" && (
                  <Pressable
                    android_disableSound
                    onPress={onLocationPress}
                    style={[
                      globalStyles.flexRow,
                      globalStyles.flex1,
                      globalStyles.alignCenter,
                      globalStyles.marginRightSize2,
                    ]}
                  >
                    <AppIcon name="location" size="extra-small" />
                    <AppLabel
                      text={post.location}
                      size="extra-small"
                      style="regular"
                      styleProp={[
                        globalStyles.marginLeftSize1,
                        globalStyles.flex1,
                      ]}
                      alignment="left"
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
                    <AppIcon name="tag-regular" size="extra-small" />
                    <AppLabel
                      text={
                        typeof post.accounts === "number"
                          ? post.accounts + " accounts"
                          : post.accounts
                      }
                      size="extra-small"
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
          </View>
          {showFollowButton && (
            <Pressable
              android_disableSound
              style={globalStyles.marginLeftSize4}
              onPress={onFollowButtonPress}
            >
              <AppLabel
                text={post.author.isFollowing ? "following" : "follow"}
                backgroundVisible
                gap="small"
                corner="small-round"
                size="extra-small"
                style="bold"
              />
            </Pressable>
          )}
        </View>
        <AppPressable
          style={[{ height: postHeight }, globalStyles.justifyCenter]}
          onDoubleTap={onDoubleTap}
          onLongPress={onMoreIconPress}
        >
          {post.type === "photo" && (
            <>
              <ImagePostBody
                isFullScreen={false}
                images={post.photo!.photos}
                coverEncoded={post.previewEncoded}
                onOffsetChange={onOffsetOrPositionChange}
              />
              <AppLabel
                text={`${offsetOrPosition + 1}/${post.photo!.photos.length}`}
                style="regular"
                foreground={COLOR_8}
                styleProp={[globalStyles.absolutePosition, styles.topLabel]}
              />
            </>
          )}
          {post.type === "video" && (
            <>
              <VideoPostBody
                isFullScreen={false}
                coverEncoded={post.previewEncoded}
                onPositionChange={onOffsetOrPositionChange}
                isFocused={isItemFocused && isScreenFocused}
                video={post.video!.video}
              />
              <AppLabel
                text={getDurationString(
                  post.video!.duration - offsetOrPosition
                )}
                style="regular"
                foreground={COLOR_8}
                styleProp={[globalStyles.absolutePosition, styles.topLabel]}
              />
            </>
          )}
          {post.type === "moment" && (
            <>
              <MomentsPostBody
                isFullScreen={false}
                coverEncoded={post.previewEncoded}
                onPositionChange={onOffsetOrPositionChange}
                isFocused={isItemFocused && isScreenFocused}
                video={post.moment!.video}
              />
              {(post.moment!.audio || post.moment!.filter) && (
                <View
                  style={[
                    globalStyles.absolutePosition,
                    styles.topLabel,
                    globalStyles.alignStart,
                  ]}
                >
                  {post.moment!.audio && (
                    <Pressable
                      style={[globalStyles.flexRow, globalStyles.alignCenter]}
                      android_disableSound
                    >
                      <SoundTrackAnimation />
                      <AppLabel
                        text={post.moment!.audio.title}
                        style="regular"
                        foreground={COLOR_8}
                        styleProp={globalStyles.marginLeftSize2}
                      />
                    </Pressable>
                  )}
                  {post.moment!.filter && (
                    <Pressable
                      style={[
                        globalStyles.flexRow,
                        globalStyles.alignCenter,
                        globalStyles.marginTopSize2,
                      ]}
                      android_disableSound
                    >
                      <AppIcon
                        name="filter"
                        size="extra-small"
                        foreground={COLOR_8}
                      />
                      <AppLabel
                        text={post.moment!.filter.name}
                        style="regular"
                        foreground={COLOR_8}
                        styleProp={globalStyles.marginLeftSize2}
                      />
                    </Pressable>
                  )}
                </View>
              )}
            </>
          )}
          {post.type !== "photo" && (
            <Pressable
              style={[globalStyles.absolutePosition, styles.bottomIcon]}
              android_disableSound
              onPress={() => dispatch(toggleMuteState())}
              hitSlop={SIZE_12}
            >
              <AppIcon
                name={isMuted ? "volume-high" : "mute"}
                foreground={COLOR_8}
                size="small"
              />
            </Pressable>
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
        </AppPressable>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignCenter,
            globalStyles.justifyAround,
            globalStyles.paddingVerticalSize4,
          ]}
        >
          <Pressable
            android_disableSound
            onPress={onMoreIconPress}
            hitSlop={SIZE_12}
          >
            <AppIcon name="info" />
          </Pressable>
          <Pressable
            android_disableSound
            onPress={onShareIconPress}
            hitSlop={SIZE_12}
          >
            <AppIcon name="share-outline" />
          </Pressable>
          <Pressable
            android_disableSound
            onPress={onCommentIconPress}
            hitSlop={SIZE_12}
          >
            <AppIcon name="comment-outline" />
          </Pressable>
          <AppPressable
            onPress={onLikeIconPress}
            hitSlop={SIZE_12}
            animatedStyle={springAnimationStyle}
          >
            <AppIcon
              name={post.isLiked ? "heart-solid" : "heart-outline"}
              foreground={post.isLiked ? COLOR_10 : COLOR_7}
            />
          </AppPressable>
        </View>
        {post.type === "video" && (
          <AppLabel
            text={post.video!.title}
            style="bold"
            styleProp={[
              globalStyles.paddingVerticalSize2,
              globalStyles.paddingHorizontalSize4,
            ]}
            alignment="left"
            noOfLines={4}
          />
        )}
        {(post.noOfComments > 0 ||
          post.noOfLikes > 0 ||
          post.noOfViews > 0) && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.paddingHorizontalSize4,
              globalStyles.paddingVerticalSize2,
              globalStyles.alignCenter,
            ]}
          >
            {post.noOfViews > 0 && (
              <AppLabel
                text={post.noOfViews + " views"}
                styleProp={globalStyles.marginRightSize4}
              />
            )}
            {post.noOfLikes > 0 && (
              <Pressable
                android_disableSound
                style={globalStyles.marginRightSize4}
                onPress={onLikeCountPress}
                hitSlop={SIZE_12}
              >
                <AppLabel text={getCountString(post.noOfLikes) + " likes"} />
              </Pressable>
            )}
            {post.noOfComments > 0 && (
              <Pressable
                android_disableSound
                onPress={onCommentIconPress}
                hitSlop={SIZE_12}
              >
                <AppLabel
                  text={getCountString(post.noOfComments) + " comments"}
                />
              </Pressable>
            )}
          </View>
        )}
        {post.likes.length > 0 && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignCenter,
              globalStyles.paddingVerticalSize2,
              globalStyles.paddingHorizontalSize4,
            ]}
          >
            <AppIcon
              name="heart-solid"
              foreground={COLOR_10}
              size="extra-small"
            />
            {post.likes.map((like) => (
              <AppAvatar
                image={like.profilePicture}
                size="extra-small"
                key={like.userid}
              />
            ))}
            {post.likes.map((like) => (
              <Pressable
                android_disableSound
                style={globalStyles.marginLeftSize2}
                onPress={() => navigateToAccount(like.userid)}
                key={like.userid}
              >
                <AppLabel text={like.userid} size="extra-small" />
              </Pressable>
            ))}
          </View>
        )}
        {post.caption !== "" && (
          <Pressable android_disableSound onPress={onCaptionPress}>
            <HighlightedText
              text={post.caption}
              author={post.author.userid}
              noOfLines={isCaptionExpanded ? undefined : 2}
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.paddingVerticalSize1,
              ]}
            />
          </Pressable>
        )}
        {post.comments.map((comment) => {
          return (
            <HighlightedText
              key={comment.id}
              text={comment.content}
              author={comment.author}
              noOfLines={1}
              style={[
                globalStyles.paddingHorizontalSize4,
                globalStyles.paddingVerticalSize1,
              ]}
            />
          );
        })}
        <Pressable
          android_disableSound
          onPress={onCommentIconPress}
          style={[
            globalStyles.flexRow,
            globalStyles.paddingVerticalSize1,
            globalStyles.paddingHorizontalSize4,
            globalStyles.alignCenter,
          ]}
        >
          <AppAvatar image={profilePicture} />
          <AppLabel
            text="Leave a comment..."
            foreground={COLOR_5}
            styleProp={globalStyles.marginLeftSize2}
            style="regular"
          />
        </Pressable>
        <AppLabel
          text={getTimeElapsedString(post.timestamp)}
          styleProp={[
            globalStyles.paddingVerticalSize1,
            globalStyles.paddingHorizontalSize4,
          ]}
          foreground={COLOR_5}
          size="extra-small"
          style="regular"
          alignment="left"
        />
      </View>
    );
  },
  () => {
    return true;
  }
);

const styles = StyleSheet.create({
  topLabel: { top: SIZE_5, left: SIZE_5 },
  bottomIcon: { right: SIZE_6, bottom: SIZE_6 },
});
