import { ReactElement, useCallback, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  ViewabilityConfig,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLOR_6,
  HEADER_HEIGHT,
  LIST_MINIMUM_VIEW_TIME_MS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SIZE_29,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconName, PostResponse } from "../../constants/types";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppLoadingIndicator } from "../utility/AppLoadingIndicator";
import { FeedPostItem } from "./FeedPostItem";

export type FeedPostListProps = {
  data: PostResponse[];
  storyLoadingAccountId: string;
  isMuted: boolean;
  showFollowButton: boolean;
  toggleMuteState: () => void;
  toggleFullScreenState: (orientation: "landscape" | "portrait") => void;
  isFullScreen: boolean;
  onAuthorFollowButtonPress: (index: number) => void;
  onAuthorAvatarPress: (index: number) => void;
  onMoreIconPress: (index: number) => void;
  onLikeIconPress: (index: number, value?: boolean) => void;
  onCommentIconPress: (index: number) => void;
  onShareIconPress: (index: number) => void;
  onTagIconPress: (index: number) => void;
  onCaptionPress: (index: number) => void;
  onLikeCountPress: (index: number) => void;
  onLocationLabelPress: (locationId: string) => void;
  onAudioLabelPress: (audioId: string) => void;
  onEffectLabelPress: (effectId: string) => void;
  onHashtagPress: (hashtag: string) => void;
  onAccountIdPress: (userId: string) => void;
  notify: (notification: string) => void;
  isRefrshing?: boolean;
  onRefresh?: () => void;
  onRetry: () => void;
  isError: boolean;
  isLoading: boolean;
  hasMorePages: boolean;
  Header?: () => ReactElement;
  Footer?: () => ReactElement;
  Fallback?: () => ReactElement;
  metadata: { isCaptionExpanded: boolean }[];
};

export function FeedPostList(props: FeedPostListProps) {
  const {
    data,
    storyLoadingAccountId,
    notify,
    onAccountIdPress,
    onAudioLabelPress,
    onAuthorAvatarPress,
    onAuthorFollowButtonPress,
    onCommentIconPress,
    onEffectLabelPress,
    onHashtagPress,
    onLikeCountPress,
    onLikeIconPress,
    onLocationLabelPress,
    onMoreIconPress,
    onShareIconPress,
    onTagIconPress,
    isRefrshing,
    onRefresh,
    isFullScreen,
    isMuted,
    toggleFullScreenState,
    toggleMuteState,
    showFollowButton,
    hasMorePages,
    isError,
    isLoading,
    onRetry,
    Footer,
    Header,
    Fallback,
    metadata,
    onCaptionPress,
  } = props;

  const [visiblePostIndex, setVisiblePostIndex] = useState(0);

  const { bottom, top, left, right } = useSafeAreaInsets();

  const viewabilityConfig = useRef<ViewabilityConfig>({
    viewAreaCoveragePercentThreshold: 100,
    minimumViewTime: LIST_MINIMUM_VIEW_TIME_MS,
  }).current;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PostResponse>) => {
      const locationLabelPressHandler = () => {
        if (item.taggedLocation) {
          onLocationLabelPress(item.taggedLocation.id);
        }
      };

      const audioLabelPressHandler = () => {
        if (item.audio) {
          onAudioLabelPress(item.audio.id);
        }
      };

      const effectLabelPressHandler = () => {
        if (item.effect) {
          onEffectLabelPress(item.effect.id);
        }
      };

      const authorFollowButtonPressHandler = () => {
        onAuthorFollowButtonPress(index);
      };

      const authorAvatarPressHandler = () => {
        onAuthorAvatarPress(index);
      };

      const likeIconPressHandler = (value?: boolean) => {
        onLikeIconPress(index, value);
      };

      const shareIconPressHandler = () => {
        onShareIconPress(index);
      };

      const commentIconPressHandler = () => {
        onCommentIconPress(index);
      };

      const moreIconPressHandler = () => {
        onMoreIconPress(index);
      };

      const tagIconPressHandler = () => {
        onTagIconPress(index);
      };

      const likeCountPressHandler = () => {
        onLikeCountPress(index);
      };

      const fullScreenStateChangeHandler = () => {
        if (item.media[0].width > item.media[0].height) {
          toggleFullScreenState("landscape");
        } else {
          toggleFullScreenState("portrait");
        }
      };

      const width = SCREEN_WIDTH - left - right;

      return (
        <FeedPostItem
          width={width}
          post={item}
          isFullScreen={isFullScreen}
          isMuted={isMuted}
          toggleFullScreen={fullScreenStateChangeHandler}
          toggleMuteState={toggleMuteState}
          isStoryLoading={storyLoadingAccountId === item.author.userId}
          isVisible={visiblePostIndex === index}
          notify={notify}
          onAccountIdPress={onAccountIdPress}
          onAudioLabelPress={audioLabelPressHandler}
          onAuthorAvatarPress={authorAvatarPressHandler}
          onAuthorFollowButtonPress={authorFollowButtonPressHandler}
          onCommentIconPress={commentIconPressHandler}
          onEffectLabelPress={effectLabelPressHandler}
          onHashtagPress={onHashtagPress}
          onLikeCountPress={likeCountPressHandler}
          onLikeIconPress={likeIconPressHandler}
          onLocationLabelPress={locationLabelPressHandler}
          onMoreIconPress={moreIconPressHandler}
          onShareIconPress={shareIconPressHandler}
          onTagIconPress={tagIconPressHandler}
          isCaptionExpanded={metadata[index].isCaptionExpanded}
          onCaptionPress={() => {
            onCaptionPress(index);
          }}
          showFollowButton={showFollowButton}
        />
      );
    },
    [
      metadata,
      onCaptionPress,
      storyLoadingAccountId,
      visiblePostIndex,
      isFullScreen,
      isMuted,
      onAuthorAvatarPress,
    ]
  );

  const viewableItemsChangedHandler = useCallback(
    ({ changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      changed.forEach((item) => {
        if (item.isViewable && item.index !== null) {
          setVisiblePostIndex(item.index);
        }
      });
    },
    []
  );

  const listEmptyComponent = useCallback(() => {
    return hasMorePages ? (
      <View
        style={[
          globalStyles.alignCenter,
          { marginTop: SCREEN_HEIGHT / 2 - SIZE_9 - top - HEADER_HEIGHT },
        ]}
      >
        {isError ? (
          <Pressable onPress={onRetry} android_disableSound hitSlop={SIZE_9}>
            <AppIcon
              name="undo"
              isBorderVisible
              foreground={COLOR_6}
              gap="medium"
            />
          </Pressable>
        ) : (
          <AppLoadingIndicator />
        )}
      </View>
    ) : Fallback ? (
      <View
        style={{ marginTop: SCREEN_HEIGHT / 2 - SIZE_9 - top - HEADER_HEIGHT }}
      >
        <Fallback />
      </View>
    ) : null;
  }, [hasMorePages, isError, Fallback]);

  const listFooter = useCallback(() => {
    return hasMorePages && data.length > 0 ? (
      <View style={[globalStyles.alignCenter]}>
        {isError ? (
          <Pressable onPress={onRetry} android_disableSound hitSlop={SIZE_9}>
            <AppIcon
              name="undo"
              isBorderVisible
              foreground={COLOR_6}
              gap="medium"
            />
          </Pressable>
        ) : (
          <AppLoadingIndicator />
        )}
      </View>
    ) : data.length > 0 && Footer ? (
      <Footer />
    ) : null;
  }, [isError, hasMorePages, data.length, Footer]);

  const listHeader = useCallback(() => {
    return !isLoading && !isError && Header ? <Header /> : null;
  }, [isLoading, isError, Header]);

  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      style={[globalStyles.stretchSelf, globalStyles.flex1]}
      renderItem={renderItem}
      extraData={props}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={viewableItemsChangedHandler}
      refreshControl={
        isRefrshing !== undefined && onRefresh !== undefined ? (
          <RefreshControl refreshing={isRefrshing} onRefresh={onRefresh} />
        ) : undefined
      }
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={listEmptyComponent}
      ListFooterComponent={listFooter}
      ListHeaderComponent={listHeader}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: HEADER_HEIGHT,
  },
  emptyListLabel: {
    marginTop: SIZE_5,
  },
  fallback: {
    height: SIZE_29,
    width: SIZE_29,
  },
});
