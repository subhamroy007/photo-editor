import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  ViewabilityConfig,
  ViewToken,
  PixelRatio,
  FlatList,
  ListRenderItemInfo,
  InteractionManager,
  Pressable,
} from "react-native";
import { FeedPostItem } from "../../components/post/FeedPostItem";
import { Avatar } from "../../components/utility/Avatar";
import { AppHeader } from "../../components/utility/AppHeader";
import { Icon } from "../../components/utility/Icon";
import { Screen } from "../../components/utility/Screen";
import {
  MAX_CONTENT_HEIGHT,
  MIN_CONTENT_HEIGHT,
  SCREEN_WIDTH,
  SIZE_1,
  SIZE_12,
  SIZE_18,
  SIZE_23,
  SIZE_25,
  SIZE_34,
  SIZE_4,
  SIZE_5,
  SIZE_7,
  SIZE_8,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  HomeStacksParams,
  RootBottomTabNavigatorParams,
  RootStackNavigatorParams,
} from "../../constants/types";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { fetchFollowingFeed } from "../../api/post/postThunk";
import { useAppInfo } from "../../hooks/useAppInfo";
import { useAccount } from "../../hooks/useAccount";
import { useInteraction } from "../../hooks/useInteraction";
import { Label } from "../../components/utility/Label";
import { Modal } from "../../components/utility/Modal";
import { Button } from "../../components/utility/Button";

export type LikesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStacksParams, "HomeFeed">,
  CompositeScreenProps<
    BottomTabScreenProps<RootBottomTabNavigatorParams, "HomeStacks">,
    NativeStackScreenProps<RootStackNavigatorParams, "BottomTabs">
  >
>;

export type StoryListProps = {
  accounts: string[];
};

export type StoryListItemProps = {
  userid: string;
};

export type FeedPostLocalParams = {
  id: string;
  type?: "following" | "suggested";
  contentHeight: number;
  totalHeight: number;
  hidden?: boolean;
};

export type LocalDataType =
  | ({ itemType: "post" } & FeedPostLocalParams)
  | ({ itemType: "account-suggestions" } & { accounts: string[] });

export type HomeFeedStateParams = {
  state: "loading" | "success" | "error";
  focusedPostId: string;
  data: LocalDataType[];
  stories: string[];
  hasNewPosts: boolean;
};

export type HomeFeedRefParams = {
  timestamp: number;
  requestCount: number;
};

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 50,
  viewAreaCoveragePercentThreshold: 50,
};

const StoryListItem = React.memo<StoryListItemProps>(({ userid }) => {
  const {
    account,
    handleStory,
    toggleFavouriteState,
    toggleFollowState,
    muteAccount,
  } = useAccount(userid);

  const [isModalOpen, setModalOpen] = useState(false);

  const { setInteraction } = useInteraction();

  const toggleModalOpenState = useCallback(() => {
    setModalOpen((prevState) => !prevState);
    setInteraction();
  }, []);

  const onMuteLabelPress = useCallback(() => {
    toggleModalOpenState();
    InteractionManager.runAfterInteractions(muteAccount);
  }, []);

  const onUnfollowLabelPress = useCallback(() => {
    toggleModalOpenState();
    InteractionManager.runAfterInteractions(toggleFollowState);
  }, []);

  const onFavouriteLabelPress = useCallback(() => {
    toggleModalOpenState();
    InteractionManager.runAfterInteractions(toggleFavouriteState);
  }, []);

  return (
    <Pressable
      android_disableSound
      onPress={handleStory}
      onLongPress={!account.isUser ? toggleModalOpenState : undefined}
      style={[
        globalStyles.alignCenter,
        globalStyles.justifyCenter,
        globalStyles.paddingHorizontalSize2,
      ]}
    >
      <Avatar
        image={account.profilePicture}
        hasRing
        isActive={account.hasUnseenStory}
        size="extra-large"
      />
      <Label
        text={account.isUser ? "your story" : account.userid}
        size="extra-small"
        style="regular"
        type={account.hasUnseenStory ? "primary" : "secondary"}
        styleProp={[globalStyles.marginTopSize2, styles.storyLabel]}
      />
      {!account.isUser && (
        <Modal
          title="Options"
          isVisible={isModalOpen}
          onDismiss={toggleModalOpenState}
        >
          <Button
            onPress={onFavouriteLabelPress}
            text={
              account.isFavourite
                ? "Remove from favourites"
                : "Add to favourites"
            }
            name="favourite"
          />
          <Button
            text={"Unfollow " + account.userid}
            name="following"
            onPress={onUnfollowLabelPress}
          />
          <Button
            text={"Mute " + account.userid}
            name="block"
            onPress={onMuteLabelPress}
          />
        </Modal>
      )}
    </Pressable>
  );
});

export function StoryList({ accounts }: StoryListProps) {
  const renderStory = useCallback(
    ({ item: userid }: ListRenderItemInfo<string>) => {
      return <StoryListItem userid={userid} />;
    },
    []
  );

  const getStoryLayout = useCallback(
    (_: string[] | null | undefined, index: number) => {
      const length = SIZE_34 + SIZE_4 * 2;
      return {
        index,
        length,
        offset: index * length,
      };
    },
    []
  );

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyles.paddingHorizontalSize2}
      getItemLayout={getStoryLayout}
      data={accounts}
      renderItem={renderStory}
      keyExtractor={(item) => item}
    />
  );
}

export function HomeFeed(_: LikesScreenProps) {
  const [homeFeedState, setHomeFeedState] = useState<HomeFeedStateParams>({
    data: [],
    focusedPostId: "",
    hasNewPosts: true,
    state: "loading",
    stories: [],
  });

  const { theme, logo, profilePicture } = useAppInfo();

  const { requestCount, timestamp } = useRef<HomeFeedRefParams>({
    requestCount: 0,
    timestamp: Date.now(),
  }).current;

  const dispatch = useStoreDispatch();

  const fetchData = useCallback(async () => {
    try {
      const result = await dispatch(
        fetchFollowingFeed({
          fetchAccountSuggestions: requestCount === 1,
          fetchStories: requestCount === 0,
          timestamp,
          fetchSuggestions: !homeFeedState.hasNewPosts,
        })
      ).unwrap();

      const newPosts = result.data.posts.map<
        FeedPostLocalParams & { itemType: "post" }
      >(({ meta: postMeta, data: postData }) => {
        let contentHeight = MAX_CONTENT_HEIGHT;
        if (postData.type === "video") {
          const measuredHeight = PixelRatio.roundToNearestPixel(
            (SCREEN_WIDTH * postData.video!.media.height) /
              postData.video!.media.width
          );
          contentHeight = Math.min(
            MAX_CONTENT_HEIGHT,
            Math.max(MIN_CONTENT_HEIGHT, measuredHeight)
          );
        }
        let totalHeight =
          contentHeight +
          (SIZE_12 + 2 * SIZE_8) +
          SIZE_23 +
          2 * SIZE_5 +
          2 * SIZE_7;
        if (postData.caption !== "") {
          totalHeight += SIZE_25 + SIZE_8;
        }
        if (postData.video && postData.video.title !== "") {
          totalHeight += SIZE_25 + SIZE_8;
        }

        if (
          postData.noOfOpinions > 0 ||
          postData.noOfLikes > 0 ||
          (postData.moment && postData.moment.noOfAudience > 0) ||
          (postData.video && postData.video.noOfAudience > 0)
        ) {
          totalHeight += SIZE_25;
        }
        return {
          contentHeight,
          totalHeight,
          type: postData.author.isFollowing ? "following" : "suggested",
          id: postData.id,
          hidden: false,
          itemType: "post",
        };
      });

      const newAccountSuggestions = result.data.suggestedAccounts.map(
        (account) => account.userid
      );

      setHomeFeedState((prevState) => {
        let newData = [];

        if (requestCount === 0) {
          newData = [...newPosts, ...prevState.data];
        } else {
          newData = [...prevState.data, ...newPosts];
          if (newAccountSuggestions.length > 0) {
            newData.push({
              itemType: "account-suggestions",
              accounts: newAccountSuggestions,
            });
          }
        }

        return {
          ...prevState,
          stories: result.data.stories.map((account) => account.userid),
          state: "success",
          hasNewPosts: result.data.posts.length < 8 ? false : true,
          data: newData,
        };
      });
    } catch (error) {
      setHomeFeedState((prevState) => ({ ...prevState, state: "error" }));
    }
  }, [homeFeedState.hasNewPosts]);

  useEffect(() => {
    if (homeFeedState.state === "loading") {
      fetchData();
    }
  }, [homeFeedState.state]);

  const onViewableItemsChanged = useCallback(
    ({ changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      changed.forEach((item) => {
        if (item.isViewable) {
          const targetItem = item.item as LocalDataType;

          if (targetItem.itemType === "post") {
            setHomeFeedState((prevState) => ({
              ...prevState,
              focusedPostId: targetItem.id,
            }));
          }
        }
      });
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LocalDataType>) => {
      if (item.itemType === "post") {
        const { contentHeight, id, type, hidden } = item;
        return (
          <FeedPostItem
            contentHeight={contentHeight}
            postId={id}
            isItemFocused={homeFeedState.focusedPostId === id}
            postType={type}
            hide={hidden}
            togglePostHideState={togglePostHideState}
          />
        );
      } else {
        return null;
      }
    },
    [homeFeedState]
  );

  const togglePostHideState = useCallback((postId: string) => {
    setHomeFeedState((prevState) => {
      const newData = prevState.data.map((item) => {
        if (item.itemType === "post" && item.id === postId) {
          item.hidden = !item.hidden;
        }
        return item;
      });
      return {
        ...prevState,
        data: [...newData],
      };
    });
  }, []);

  return (
    <Screen>
      <AppHeader
        leftnode={<Avatar image={profilePicture} />}
        titlenode={
          <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
            <Image
              resizeMode="contain"
              style={{ width: 90, height: 30, bottom: 5 }}
              source={logo}
            />
            <Icon
              name="chevron-down"
              size="extra-small"
              styleProp={globalStyles.marginLeftSize2}
            />
          </View>
        }
        rightIcon="finder"
      />

      <FlatList
        data={homeFeedState.data}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        extraData={homeFeedState}
        ItemSeparatorComponent={() => (
          <View
            style={[
              globalStyles.primaryBottomBorderWidth,
              globalStyles.primaryLightBorderColor,
            ]}
          />
        )}
        ListHeaderComponent={<StoryList accounts={homeFeedState.stories} />}
        ListHeaderComponentStyle={[
          homeFeedState.stories.length !== 0 ? styles.storyList : { height: 0 },
          globalStyles.primaryBottomBorderWidth,
          theme === "light"
            ? globalStyles.primaryLightBorderColor
            : globalStyles.primaryDarkBorderColor,
        ]}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  storyList: {
    height: SIZE_1,
  },
  storyLabel: { maxWidth: SIZE_34 },
});
