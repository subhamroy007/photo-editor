import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  InteractionManager,
  Pressable,
  StyleSheet,
  View,
  Image,
} from "react-native";
import {
  COLOR_1,
  COLOR_10,
  COLOR_11,
  SIZE_12,
  SIZE_14,
  SIZE_7,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { MediaParams, PostItemProps } from "../../constants/types";
import { getCountString, getDurationString } from "../../constants/utility";
import { Icon } from "../utility/Icon";
import { Label } from "../utility/Label";
import { AppPressable } from "../utility/AppPressable";
import { HighlightedText } from "../utility/HighlightedText";
import { Avatar } from "../utility/Avatar";
import { Modal } from "../utility/Modal";
import { Button } from "../utility/Button";
import { useInteraction } from "../../hooks/useInteraction";
import { RoundIcon } from "../utility/RoundIcon";
import { useImage } from "../../hooks/useImage";
import { ImageDeck } from "../utility/ImageDeck";
import { MediaLoadingIndicator } from "../utility/MediaLoadingIndicator";
import { usePost } from "../../hooks/usePost";
import { Video } from "expo-av";
import { useVideo } from "../../hooks/useVideo";
import { SoundTrackAnimation } from "../utility/SoundTrackAnimation";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { toggleMute } from "../../api/global/appSlice";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { selectMuteState } from "../../api/global/appSelector";

export type FallbackProps = {
  encodedImage: string;
  title: string;
  info: string;
  undo: () => void;
};

export type ImagePostBodyProps = {
  images: MediaParams[];
  cover: string;
};

function ImagePostBody({ images, cover }: ImagePostBodyProps) {
  const { onRetry, state } = useImage(images);

  const [imageIndex, setImageIndex] = useState(0);

  const onImageIndexChange = useCallback((newImageIndex: number) => {
    setImageIndex(newImageIndex);
  }, []);

  return state === "ready" ? (
    <>
      <ImageDeck images={images} onIndexChange={onImageIndexChange} />
      {images.length > 1 && (
        <Label
          text={`${imageIndex + 1}/${images.length}`}
          style="regular"
          styleProp={[
            globalStyles.absolutePosition,
            styles.top,
            styles.left,
            globalStyles.marginTopSize4,
            globalStyles.marginLeftSize4,
            globalStyles.alignSelfStart,
          ]}
          transparent
        />
      )}
    </>
  ) : (
    <MediaLoadingIndicator
      cover={cover}
      isError={state === "error"}
      onRetry={onRetry}
    />
  );
}

export type MomentsPostBodyProps = {
  video: MediaParams;
  cover: string;
  play: boolean;
};

function MomentsPostBody({ cover, video, play }: MomentsPostBodyProps) {
  const ref = useRef<Video | null>(null);

  const { onRetry, state } = useVideo(video, ref);

  useEffect(() => {
    if (state === "ready") {
      ref.current?.setStatusAsync({ isLooping: true, isMuted: false });
    }
  }, [state]);

  useEffect(() => {
    if (play) {
      ref.current?.setStatusAsync({ shouldPlay: true });
    } else {
      ref.current?.setStatusAsync({ shouldPlay: false });
    }
  }, [play]);

  const dispatch = useStoreDispatch();

  const switchMuteState = useCallback(() => {
    dispatch(toggleMute());
  }, []);

  const isMuted = useStoreSelector(selectMuteState);

  useEffect(() => {
    ref.current?.setIsMutedAsync(isMuted);
  }, [isMuted]);

  return (
    <>
      <Video
        ref={ref}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <Pressable
        android_disableSound
        hitSlop={SIZE_12}
        style={[
          globalStyles.absolutePosition,
          globalStyles.marginRightSize4,
          globalStyles.marginBottomSize4,
          styles.bottom,
          styles.right,
        ]}
        onPress={switchMuteState}
      >
        <RoundIcon
          name={isMuted ? "mute" : "volume-high"}
          size="extra-small"
          style="solid"
          background={COLOR_11}
          gap="medium"
          transparent
        />
      </Pressable>
      {state !== "ready" && (
        <MediaLoadingIndicator
          cover={cover}
          isError={state === "error"}
          onRetry={onRetry}
        />
      )}
    </>
  );
}

export type VideoPostBodyProps = {
  video: MediaParams;
  cover: string;
  focused: boolean;
};

function VideoPostBody({ cover, video, focused }: VideoPostBodyProps) {
  const ref = useRef<Video | null>(null);

  const { onRetry, state } = useVideo(video, ref);

  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (state === "ready") {
      ref.current?.setStatusAsync({
        isLooping: true,
        isMuted: false,
        progressUpdateIntervalMillis: 1000,
      });
      ref.current?.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.durationMillis! - status.positionMillis);
        }
      });
    }
  }, [state]);

  const isMuted = useStoreSelector(selectMuteState);

  useEffect(() => {
    if (focused) {
      ref.current?.setStatusAsync({ shouldPlay: true });
    } else {
      ref.current?.setStatusAsync({ shouldPlay: false });
    }
  }, [focused]);

  useEffect(() => {
    ref.current?.setIsMutedAsync(isMuted);
  }, [isMuted]);

  const dispatch = useStoreDispatch();

  const switchMuteState = useCallback(() => {
    dispatch(toggleMute());
  }, []);

  return (
    <>
      <Video
        ref={ref}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
      <Label
        text={getDurationString(position)}
        style="regular"
        styleProp={[
          globalStyles.absolutePosition,
          styles.top,
          styles.left,
          globalStyles.marginTopSize4,
          globalStyles.marginLeftSize4,
          globalStyles.alignSelfStart,
        ]}
        transparent
      />
      <Pressable
        android_disableSound
        hitSlop={SIZE_12}
        style={[
          globalStyles.absolutePosition,
          globalStyles.marginRightSize4,
          globalStyles.marginBottomSize4,
          styles.bottom,
          styles.right,
        ]}
        onPress={switchMuteState}
      >
        <RoundIcon
          name={isMuted ? "mute" : "volume-high"}
          size="extra-small"
          style="solid"
          background={COLOR_11}
          gap="medium"
          transparent
        />
      </Pressable>
      {state !== "ready" && (
        <MediaLoadingIndicator
          cover={cover}
          isError={state === "error"}
          onRetry={onRetry}
        />
      )}
    </>
  );
}

export function Fallback({ encodedImage, info, title, undo }: FallbackProps) {
  return (
    <>
      <Image
        resizeMode="cover"
        style={[{ width: "100%", height: "100%" }]}
        source={{ uri: encodedImage }}
        fadeDuration={0}
        blurRadius={10}
      />
      <View
        style={[
          globalStyles.absolutePosition,
          globalStyles.semiTransparentBackgroundColor,
          globalStyles.alignSelfCenter,
          globalStyles.borderTopRadiusSize3,
          globalStyles.borderBottomRadiusSize3,
          {
            width: "80%",
          },
        ]}
      >
        <RoundIcon
          name="tick"
          size="large"
          transparent
          styleProp={[
            globalStyles.marginBottomSize4,
            globalStyles.marginTopSize4,
          ]}
          gap="small"
        />
        <Label text={title} size="medium" transparent gapVertical="small" />
        <Label
          text={info}
          noOfLines={4}
          textAlign="center"
          size="extra-small"
          style="regular"
          gapHorizontal="large"
          gapVertical="small"
          transparent
        />
        <Pressable
          style={[
            globalStyles.borderBottomRadiusSize3,
            globalStyles.primaryDarkBorderColor,
            globalStyles.primaryTopBorderWidth,
            globalStyles.marginTopSize4,
          ]}
          android_disableSound
          onPress={undo}
        >
          <Label gap="extra-large" text="Undo" transparent />
        </Pressable>
      </View>
    </>
  );
}

export const FeedPostItem = React.memo<PostItemProps>(
  (props) => {
    const {
      postId,
      isItemFocused,
      contentHeight,
      postType,
      togglePostHideState,
      hide,
    } = props;

    const {
      post,
      author,
      handleStory,
      isAccountFollowing,
      muteAccount,
      shareLink,
      toggleBookmarkState,
      toggleFavouriteState,
      toggleFollowState,
      navigateToAccount,
      toggleLikeState,
      navigateToAudio,
      navigateToEffect,
      navigateToLikes,
      navigateToLocation,
      navigateToPost,
    } = usePost(postId);

    const switchHideState = useCallback(() => togglePostHideState(postId), []);

    const { setInteraction } = useInteraction();

    const [isMoreOptionModalOpen, setMoreOptionModalOpen] = useState(false);

    const toggleMoreOptionModalOpenState = useCallback(() => {
      setMoreOptionModalOpen((prevState) => !prevState);
      setInteraction();
    }, []);

    const onShareToPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(async () => {
        await shareLink(true);
      });
    }, []);

    const onReportPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
    }, []);

    const onBookmarkPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(() => {
        toggleBookmarkState();
      });
    }, []);

    const onGotoPostPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(() => {
        navigateToPost();
      });
    }, []);

    const onDeletePress = useCallback(() => {
      toggleMoreOptionModalOpenState();
    }, []);

    const onHidePress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(switchHideState);
    }, []);

    const onCopyLinkPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(async () => {
        await shareLink();
      });
    }, []);

    const onFavouritePress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(() => {
        toggleFavouriteState();
      });
    }, []);

    const onUnfollowPress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(() => {
        toggleFollowState();
      });
    }, []);

    const onMutePress = useCallback(() => {
      toggleMoreOptionModalOpenState();
      InteractionManager.runAfterInteractions(() => {
        muteAccount();
      });
    }, []);

    const isScreenFocused = useIsFocused();

    const onOpinion = useCallback(() => {}, []);

    const showTagView = post.location !== "" || post.account !== 0;

    const showEngagementView =
      post.noOfLikes > 0 ||
      post.noOfOpinions > 0 ||
      (post.type !== "photo" && post.noOfAudience > 0);

    return (
      <View>
        {!hide && (
          <Pressable
            style={[
              globalStyles.flexRow,
              globalStyles.paddingVerticalSize3,
              globalStyles.paddingHorizontalSize4,
              globalStyles.alignCenter,
            ]}
            android_disableSound
            onPress={navigateToAccount}
          >
            <Pressable android_disableSound onPress={handleStory}>
              <Avatar
                image={author.profilePicture}
                hasRing={author.hasUnseenStory}
                isActive={author.hasUnseenStory}
              />
            </Pressable>
            <View
              style={[globalStyles.marginLeftSize4, globalStyles.alignStart]}
            >
              <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
                <Label text={author.userid} />
                {isAccountFollowing && (
                  <Label
                    text={author.isFollowing ? "Following" : "Follow"}
                    foreground={COLOR_1}
                    styleProp={globalStyles.marginLeftSize4}
                    style="medium"
                    onPress={toggleFollowState}
                  />
                )}
              </View>
              <Label
                text={post.timestamp}
                styleProp={globalStyles.marginTopSize1}
                size="extra-small"
                style="regular"
                type="info"
              />
            </View>
            {author.isFavourite && (
              <Icon
                name="star"
                size="extra-small"
                styleProp={globalStyles.marginLeftAuto}
                foreground={COLOR_10}
              />
            )}
            <Pressable
              android_disableSound
              hitSlop={SIZE_14}
              style={
                author.isFavourite
                  ? globalStyles.marginLeftSize7
                  : globalStyles.marginLeftAuto
              }
              onPress={toggleMoreOptionModalOpenState}
            >
              <Icon name="ellipses" size="small" />
            </Pressable>
          </Pressable>
        )}
        <View style={[{ height: contentHeight }, globalStyles.justifyCenter]}>
          {hide ? (
            <Fallback
              encodedImage={post.thumbnail}
              info={
                postType === "following"
                  ? "post hidden, you will see post from this author at the bottom of the feed"
                  : "thank you for your feedback, you will see this kind of post less in your suggestion"
              }
              title={postType === "following" ? "Hidden" : "Not interested"}
              undo={switchHideState}
            />
          ) : (
            <>
              {post.type === "photo" && (
                <ImagePostBody cover={post.thumbnail} images={post.photos} />
              )}
              {post.type === "moment" && (
                <>
                  <MomentsPostBody
                    cover={post.thumbnail}
                    video={post.video}
                    play={isItemFocused && isScreenFocused}
                  />
                  {post.audio && (
                    <Pressable
                      onPress={navigateToAudio}
                      android_disableSound
                      style={[
                        globalStyles.flexRow,
                        globalStyles.alignCenter,
                        globalStyles.absolutePosition,
                        styles.top,
                        styles.left,
                        globalStyles.marginLeftSize4,
                        globalStyles.marginTopSize4,
                      ]}
                    >
                      <SoundTrackAnimation />
                      <Label
                        text={post.audio.name}
                        size="extra-small"
                        style="regular"
                        transparent
                        styleProp={globalStyles.marginLeftSize2}
                      />
                    </Pressable>
                  )}
                </>
              )}
              {post.type === "video" && (
                <VideoPostBody
                  cover={post.thumbnail}
                  video={post.video}
                  focused={isItemFocused && isScreenFocused}
                />
              )}
            </>
          )}
        </View>
        {!hide && (
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignCenter,
              globalStyles.justifyAround,
              globalStyles.paddingVerticalSize4,
            ]}
          >
            <Pressable android_disableSound hitSlop={SIZE_9}>
              <Icon name="forward" />
            </Pressable>
            <Pressable
              android_disableSound
              hitSlop={SIZE_9}
              onPress={onOpinion}
            >
              <Icon name="comment" />
            </Pressable>
            <AppPressable hitSlop={SIZE_9} onPress={toggleLikeState}>
              <Icon
                name={post.isLiked ? "heart-solid" : "heart-outline"}
                foreground={post.isLiked ? COLOR_10 : undefined}
              />
            </AppPressable>
          </View>
        )}
        {!hide && (
          <Pressable
            android_disableSound
            onPress={navigateToPost}
            style={[globalStyles.paddingHorizontalSize4, styles.postFooter]}
          >
            {showEngagementView && (
              <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
                {post.noOfLikes > 0 && (
                  <Label
                    text={getCountString(post.noOfLikes) + " likes"}
                    styleProp={globalStyles.marginRightSize2}
                  />
                )}
                {post.noOfOpinions > 0 && (
                  <Label
                    text={getCountString(post.noOfOpinions) + " opinions"}
                    styleProp={globalStyles.marginRightSize2}
                  />
                )}
                {post.type !== "photo" && post.noOfAudience > 0 && (
                  <Label
                    text={getCountString(post.noOfAudience) + " audience"}
                  />
                )}
              </View>
            )}
            {post.type === "video" && (
              <Label
                text={post.title}
                noOfLines={2}
                styleProp={globalStyles.marginTopSize3}
              />
            )}
            {post.caption !== "" && (
              <HighlightedText
                text={post.caption}
                noOfLines={2}
                style={globalStyles.marginTopSize3}
              />
            )}
            {showTagView && (
              <View
                style={[
                  globalStyles.flexRow,
                  globalStyles.alignCenter,
                  globalStyles.marginTopSize3,
                ]}
              >
                {post.location !== "" && (
                  <Pressable
                    android_disableSound
                    onPress={navigateToLocation}
                    style={[
                      globalStyles.flexRow,
                      globalStyles.alignCenter,
                      globalStyles.marginRightSize3,
                    ]}
                  >
                    <Icon
                      name="location"
                      size="extra-small"
                      type="secondary"
                      styleProp={globalStyles.marginRightSize1}
                    />
                    <Label
                      text={post.location}
                      size="small"
                      style="regular"
                      type="secondary"
                    />
                  </Pressable>
                )}
                {post.account !== 0 && (
                  <Pressable
                    android_disableSound
                    style={[globalStyles.flexRow, globalStyles.alignCenter]}
                  >
                    <Icon
                      name="tag-solid"
                      size="extra-small"
                      styleProp={globalStyles.marginRightSize1}
                      type="secondary"
                    />
                    <Label
                      text={
                        typeof post.account === "number"
                          ? post.account + " accounts"
                          : post.account
                      }
                      size="small"
                      style="regular"
                      type="secondary"
                    />
                  </Pressable>
                )}
              </View>
            )}
          </Pressable>
        )}
        {!hide && (
          <Modal
            isVisible={isMoreOptionModalOpen}
            onDismiss={toggleMoreOptionModalOpenState}
            title="Options"
          >
            <Button text="Go To Post" onPress={onGotoPostPress} name="info" />
            <Button
              text={post.isSaved ? "Unsave" : "Save"}
              onPress={onBookmarkPress}
              name={post.isSaved ? "bookmark-solid" : "bookmark-outline"}
            />
            <Button text="Copy link" onPress={onCopyLinkPress} name="link" />
            <Button text="Share to" onPress={onShareToPress} name="share" />
            {isAccountFollowing && postType === "following" && (
              <>
                <Button
                  onPress={onFavouritePress}
                  text={
                    author.isFavourite
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                  name="favourite"
                />
                <Button
                  text={"Unfollow " + author.userid}
                  name="following"
                  onPress={onUnfollowPress}
                />
                <Button
                  text={"Mute " + author.userid}
                  name="block"
                  onPress={onMutePress}
                />
                <Button text={"Hide"} onPress={onHidePress} name="hide" />
              </>
            )}
            {postType === "suggested" && (
              <Button
                text={"Not interested"}
                onPress={onHidePress}
                name="hide"
              />
            )}
            {author.isUser ? (
              <Button
                text="Delete"
                onPress={onDeletePress}
                color={COLOR_10}
                name="trash"
              />
            ) : (
              <Button
                text="Report"
                onPress={onReportPress}
                color={COLOR_10}
                name="report"
              />
            )}
          </Modal>
        )}
      </View>
    );
  },
  (prevState, nextState) => {
    return (
      prevState.isItemFocused === nextState.isItemFocused &&
      prevState.hide === nextState.hide
    );
  }
);

const styles = StyleSheet.create({
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
  postFooter: { paddingTop: SIZE_7, paddingBottom: SIZE_9 },
});
