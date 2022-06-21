import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import {
  COLOR_1,
  COLOR_10,
  COLOR_6,
  COLOR_7,
  COLOR_9,
  SIZE_21,
  SIZE_25,
  SIZE_29,
  SIZE_4,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { FeedPostTemplateProps } from "../../constants/types";
import { getTimeElapsedString } from "../../constants/utility";
import { AppAvatar } from "../utility/AppAvatar";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { AppText } from "../utility/AppText";
import { MediaRenderingComponent } from "../utility/MediaRenderingComponent";

export function FeedPostTemplate(props: FeedPostTemplateProps) {
  const {
    post: {
      author,
      caption,
      isLiked,
      isSaved,
      noOfComments,
      noOfLikes,
      noOfViews,
      taggedLocation,
      timestamp,
      title,
      topComments,
      topLikes,
      poster,
      taggedAccounts,
    },
    index,
    isStoryLoading,
    isVisible,
    width,
    height,
    children,
    onMoreIconPress,
    onAuthorAvatarPress,
    onAuthorIdPress,
    showFollowButton,
    onFollowButtonPress,
    onAccountPress,
    onBookmarkPress,
    onCommentPress,
    onHashtagPress,
    onLikeCountPress,
    onLikePress,
    onLocationPress,
    onSharePress,
    loadAsync,
    onLoad,
    notify,
    onTagIconPress,
  } = props;

  const moreIconPressHandler = useCallback(() => {
    onMoreIconPress(index);
  }, [index]);

  const authorAvatarPressHandler = useCallback(() => {
    onAuthorAvatarPress(index);
  }, [index]);

  const authorIdPressHandler = useCallback(() => {
    onAuthorIdPress(index);
  }, [index]);

  const followButtonPressHandler = useCallback(() => {
    onFollowButtonPress(index);
  }, [index]);

  const likeIconPressHandler = useCallback(() => {
    onLikePress(index);
  }, [index]);

  const commentIconPressHandler = useCallback(() => {
    onCommentPress(index);
  }, [index]);

  const shareIconPressHandler = useCallback(() => {
    onSharePress(index);
  }, [index]);

  const bookmarkIconPressHandler = useCallback(() => {
    onBookmarkPress(index);
  }, [index]);

  const locationPressHandler = useCallback(() => {
    onLocationPress(index);
  }, [index]);

  const likeCountPressHandler = useCallback(() => {
    onLikeCountPress(index);
  }, [index]);

  const doubleTapHandler = useCallback(() => {
    onLikePress(index, true);
  }, [index]);

  const errorHandler = useCallback(() => {
    notify("something went wrong");
  }, []);

  const tapHandler = useCallback(() => {}, [index]);

  const longPressHandler = useCallback(() => {
    onTagIconPress(index);
  }, [index]);

  return (
    <Animated.View>
      {/* post header consist of author informition */}
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.justifyBetween,
          globalStyles.alignCenter,
          styles.header,
        ]}
      >
        <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
          <Pressable
            android_disableSound
            hitSlop={SIZE_5}
            onPress={authorAvatarPressHandler}
          >
            <AppAvatar
              hasRing={author.hasUnseenStory}
              type={isStoryLoading ? "animated" : "active"}
              uri={author.profilePictureUri}
            />
          </Pressable>
          <Pressable
            android_disableSound
            hitSlop={SIZE_5}
            onPress={authorIdPressHandler}
            style={[styles.leftMarginSmall, styles.authorIdContainer]}
          >
            <AppLabel text={author.userId} foreground={COLOR_7} />
          </Pressable>

          {showFollowButton && (
            <Pressable
              android_disableSound
              hitSlop={SIZE_5}
              onPress={followButtonPressHandler}
              style={styles.leftMarginSmall}
            >
              <AppLabel
                text={author.isFollowing ? "followed" : "follow"}
                foreground={COLOR_1}
                style="bold"
              />
            </Pressable>
          )}
        </View>
        <Pressable
          hitSlop={SIZE_9}
          android_disableSound
          onPress={moreIconPressHandler}
          style={[styles.rightMarginSmall]}
        >
          <AppIcon name="more" size="small" foreground={COLOR_7} />
        </Pressable>
      </View>
      <MediaRenderingComponent
        disabled={!isVisible}
        onDoubleTap={doubleTapHandler}
        width={width}
        height={height}
        poster={poster}
        type="post"
        loadAsync={loadAsync}
        onError={errorHandler}
        onLoad={onLoad}
        onLongPress={longPressHandler}
        onTap={tapHandler}
      >
        {children}
        {taggedAccounts.length > 0 && (
          <AppPressable
            hitslop={SIZE_9}
            onPress={longPressHandler}
            styleProp={[globalStyles.absolutePosition, styles.tagIcon]}
          >
            <AppIcon
              name="tag-bold"
              size="extra-small"
              isBackgroundVisible
              background={COLOR_9}
            />
          </AppPressable>
        )}
      </MediaRenderingComponent>
      {/* icons to interact with the post */}
      <View
        style={[
          globalStyles.justifyBetween,
          globalStyles.flexRow,
          styles.iconsContainer,
        ]}
      >
        <View style={[globalStyles.flexRow]}>
          <AppPressable
            onPress={likeIconPressHandler}
            hitslop={SIZE_9}
            styleProp={styles.leftMarginSmall}
          >
            <AppIcon
              name={isLiked ? "heart-solid" : "heart-outline"}
              foreground={isLiked ? COLOR_10 : COLOR_7}
            />
          </AppPressable>
          <Pressable
            onPress={commentIconPressHandler}
            android_disableSound
            hitSlop={SIZE_9}
            style={styles.leftMarginExtraLarge}
          >
            <AppIcon name="comment-outline" foreground={COLOR_7} />
          </Pressable>
          <Pressable
            onPress={shareIconPressHandler}
            android_disableSound
            hitSlop={SIZE_9}
            style={styles.leftMarginExtraLarge}
          >
            <AppIcon name="share-outline" foreground={COLOR_7} />
          </Pressable>
        </View>
        <AppPressable
          onPress={bookmarkIconPressHandler}
          hitslop={SIZE_9}
          styleProp={styles.rightMarginSmall}
        >
          <AppIcon
            name={isSaved ? "bookmark-solid" : "bookmark-outline"}
            foreground={COLOR_7}
          />
        </AppPressable>
      </View>
      {/* render the tagged location if any */}
      {taggedLocation && (
        <Pressable
          onPress={locationPressHandler}
          style={[
            globalStyles.flexRow,
            globalStyles.alignCenter,
            styles.locationContainer,
          ]}
          android_disableSound
        >
          <AppIcon name="location" foreground={COLOR_1} size="extra-small" />
          <AppLabel
            style="regular"
            foreground={COLOR_1}
            text={taggedLocation.name}
          />
        </Pressable>
      )}
      {/* render title if available */}
      {title !== "" && (
        <AppLabel
          text={title}
          foreground={COLOR_7}
          style="medium"
          size="medium"
          noOfLines={2}
          gap="small"
          styleProp={globalStyles.alignSelfStart}
        />
      )}
      {/* render views if any */}
      {noOfViews > 0 && (
        <AppLabel
          text={noOfViews + " views"}
          foreground={COLOR_7}
          gap="small"
          styleProp={globalStyles.alignSelfStart}
          noOfLines={1}
        />
      )}
      {/* render views count and top likes if any */}
      {noOfLikes > 0 &&
        (topLikes.length === 0 ? (
          <AppLabel
            text={noOfLikes === 1 ? "1 like" : noOfLikes + " likes"}
            gap="small"
            foreground={COLOR_7}
            onPress={likeCountPressHandler}
            styleProp={globalStyles.alignSelfStart}
          />
        ) : (
          <Text style={[styles.likeContainer, globalStyles.alignSelfStart]}>
            <AppLabel
              text="liked by "
              foreground={COLOR_7}
              style="regular"
              styleProp={globalStyles.lineHeightUndefined}
            />
            {topLikes.map((like) => (
              <AppLabel
                text={like.userId + " "}
                foreground={COLOR_7}
                key={like.id}
                onPress={() => {
                  onAccountPress(like.userId);
                }}
                styleProp={globalStyles.lineHeightUndefined}
              />
            ))}
            {noOfLikes - topLikes.length > 0 && (
              <>
                <AppLabel
                  text="and "
                  foreground={COLOR_7}
                  style="regular"
                  styleProp={globalStyles.lineHeightUndefined}
                />
                <AppLabel
                  text={noOfLikes - topLikes.length + " other"}
                  foreground={COLOR_7}
                  onPress={likeCountPressHandler}
                  styleProp={globalStyles.lineHeightUndefined}
                />
              </>
            )}
          </Text>
        ))}
      {/* render caption if available */}
      {caption !== "" && (
        <Text
          numberOfLines={200}
          ellipsizeMode="tail"
          style={[globalStyles.alignSelfStart, styles.caption]}
        >
          <AppLabel
            text={author.userId + " "}
            foreground={COLOR_7}
            onPress={authorIdPressHandler}
            styleProp={globalStyles.lineHeightUndefined}
          />
          <AppText
            text={caption}
            onPress={(text: string) => {
              if (text.startsWith("@")) {
                onAccountPress(text);
              } else {
                onHashtagPress(text);
              }
            }}
            styleProp={globalStyles.lineHeightUndefined}
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
          onPress={commentIconPressHandler}
          gap="small"
          styleProp={globalStyles.alignSelfStart}
        />
      )}
      {/* render the top comments if any */}
      {topComments.map((comment) => {
        return (
          <Text
            key={comment.id}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.comment, globalStyles.alignSelfStart]}
            onPress={commentIconPressHandler}
          >
            <AppLabel
              text={comment.author.userId + " "}
              foreground={COLOR_7}
              onPress={() => {
                onAccountPress(comment.author.userId);
              }}
            />
            <AppText
              text={comment.content}
              onPress={(text: string) => {
                if (text.startsWith("@")) {
                  onAccountPress(text);
                } else {
                  onHashtagPress(text);
                }
              }}
            />
          </Text>
        );
      })}
      {/* show the comment box */}
      <Pressable
        style={[
          styles.commentBox,
          globalStyles.flexRow,
          globalStyles.alignCenter,
        ]}
        onPress={commentIconPressHandler}
      >
        <AppAvatar uri={author.profilePictureUri} size="extra-small" />
        <AppLabel
          text="leave a comment..."
          foreground={COLOR_6}
          style="regular"
          size="small"
          styleProp={styles.leftMarginSmall}
        />
      </Pressable>
      {/* show timestamp */}
      <AppLabel
        text={getTimeElapsedString(timestamp)}
        size="extra-small"
        foreground={COLOR_6}
        style="regular"
        gap="small"
        styleProp={globalStyles.alignSelfStart}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  authorIdContainer: {
    maxWidth: SIZE_29,
  },
  iconsContainer: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  locationContainer: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  likeContainer: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
    lineHeight: Math.floor(SIZE_25 * 1.3),
  },
  caption: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
    lineHeight: Math.floor(SIZE_25 * 1.3),
  },
  comment: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  commentBox: {
    paddingHorizontal: SIZE_5,
    paddingVertical: SIZE_4,
  },
  leftMarginSmall: {
    marginLeft: SIZE_4,
  },
  leftMarginExtraLarge: {
    marginLeft: SIZE_21,
  },
  rightMarginSmall: {
    marginRight: SIZE_4,
  },
  tagIcon: {
    left: SIZE_9,
    bottom: SIZE_9,
  },
});
