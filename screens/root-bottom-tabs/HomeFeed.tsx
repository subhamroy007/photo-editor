import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TextSize from "react-native-text-size";
import { AccountList } from "../../components/post/account/AccountList";
import { StoryList } from "../../components/post/account/StoryList";
import { FeedPostList } from "../../components/post/FeedPostList";
import { AppDialogBox } from "../../components/utility/AppDialogBox";
import { AppHeader } from "../../components/utility/AppHeader";
import { AppIcon } from "../../components/utility/AppIcon";
import { AppLabel } from "../../components/utility/AppLabel";
import { AppModal } from "../../components/utility/AppModal";
import { Tappable } from "../../components/utility/Tappable";
import {
  ACCOUNT_LIST_ITEM_SIZE,
  COLOR_1,
  COLOR_12,
  COLOR_13,
  COLOR_14,
  COLOR_16,
  COLOR_7,
  COLOR_8,
  SCREEN_WIDTH,
  SIZE_10,
  SIZE_14,
  SIZE_25,
  SIZE_31,
  SIZE_32,
  SIZE_33,
  SIZE_35,
  SIZE_4,
  SIZE_5,
} from "../../constants/constants";
import { ACCOUNT_DATA, POST_DATA, REPORT_REASONS } from "../../constants/data";
import { globalStyles } from "../../constants/style";
import {
  AccountShortResponse,
  PostResponse,
  RootBottomTabNavigatorParams,
  RootMaterialTopTabNavigatorParams,
  RootStackNavigatorParams,
} from "../../constants/types";
import { usePopupAnimation } from "../../hooks/usePopupAnimation";
import { useStatusBar } from "../../hooks/useStatusBar";

type HomeFeedNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<RootBottomTabNavigatorParams, "HomeFeed">,
  CompositeScreenProps<
    MaterialTopTabScreenProps<RootMaterialTopTabNavigatorParams, "BottomTabs">,
    NativeStackScreenProps<RootStackNavigatorParams, "MaterialTopTabs">
  >
>;

export type PostMetadataParams = {
  isCaptionExpanded: boolean;
  captionHeight: number;
  noOfLinesInCaption: number;
  titleHeight: number;
};

export function HomeFeed({ navigation }: HomeFeedNavigationProps) {
  useStatusBar();

  const [scheduledTask, setScheduledTask] = useState<
    | "report"
    | "share"
    | "link"
    | "mute"
    | "unfollow"
    | "hide"
    | "save"
    | "favourite"
    | ""
  >("");

  const [scheduledMuteMode, setScheduledMuteMode] = useState<
    "post" | "story" | "all" | ""
  >("");

  const [removePostConfirmed, setRemovePostConfirmed] = useState(false);

  const [unfollowConfirmed, setUnfollowConfirmed] = useState(false);

  const { popupAnimatedStyle, startPopupAnimation } = usePopupAnimation();

  const [notification, setNotification] = useState("");

  const [scheduledReport, setScheduledReport] = useState("");

  const [isMoreOptionModalOpen, setMoreOptioModal] = useState(false);

  const [isReportModalOpen, setReportOptionModal] = useState(false);

  const [selectedPostIndex, setSelectedPostIndex] = useState(-1);

  const [isPostMuteDialogBoxOpen, setPostMuteDialogBoxOpen] = useState(false);

  const [isPostHideDialogBoxOpen, setPostHideDialogBoxOpen] = useState(false);

  const [isUnfollowDialogBoxOpen, setUnfollowDialogBoxOpen] = useState(false);

  const [isTagModalOpen, setTagModalOpen] = useState(false);

  const [isStoryModalOpen, setStoryModalOpen] = useState(false);

  const [selectedStoryIndex, setSelectedStoryIndex] = useState(-1);

  const toggleStoryModalOpen = useCallback(() => {
    setStoryModalOpen((prevState) => !prevState);
  }, []);

  const togglePostHideDialogBoxState = useCallback(() => {
    setPostHideDialogBoxOpen((prevState) => !prevState);
  }, []);

  const toggleUnfollowDialogBoxState = useCallback(() => {
    setUnfollowDialogBoxOpen((prevState) => !prevState);
  }, []);

  const toggleMoreOptionModalState = useCallback(() => {
    setMoreOptioModal((prevState) => !prevState);
  }, []);

  const toggleReportModalOpenState = useCallback(() => {
    setReportOptionModal((prevState) => !prevState);
  }, []);

  const togglePostMuteDialogBox = useCallback(() => {
    setPostMuteDialogBoxOpen((prevState) => !prevState);
  }, []);

  const toggleTagModalOpenState = useCallback(() => {
    setTagModalOpen((prevState) => !prevState);
  }, []);

  const [
    {
      posts,
      hasMorePage,
      isError,
      isLoading,
      stories,
      loadingStoryAccountId,
      postMetadata,
    },
    setHomeFeedState,
  ] = useState<{
    isLoading: boolean;
    isError: boolean;
    hasMorePage: boolean;
    posts: PostResponse[];
    stories: AccountShortResponse[];
    loadingStoryAccountId: string;
    postMetadata: PostMetadataParams[];
  }>({
    posts: [],
    hasMorePage: true,
    isError: false,
    isLoading: true,
    stories: [],
    loadingStoryAccountId: "",
    postMetadata: [],
  });

  const notificationHandler = useCallback((notification: string) => {}, []);

  const accountIdPressHandler = useCallback(
    (accountId: string) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "Profile", params: { userId: accountId } },
        },
      });
    },
    [navigation]
  );

  const audioLabelPressHandler = useCallback(
    (audioId: string) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "Audio", params: { audioId } },
        },
      });
    },
    [navigation]
  );

  const authorAvatarPressHandler = useCallback(
    (index: number) => {
      if (posts[index].author.hasUnseenStory) {
        console.log("go to story screen to see the unseen story of the author");
        //TODO :- navigate to story screen
      } else {
        navigation.push("MaterialTopTabs", {
          screen: "BottomTabs",
          params: {
            screen: "UtilityStacks",
            params: {
              screen: "Profile",
              params: { userId: posts[index].author.userId },
            },
          },
        });
      }
    },
    [posts, navigation]
  );

  const authorFollowButtonPressHandler = useCallback((index: number) => {
    setHomeFeedState((prevState) => {
      return {
        ...prevState,
        data: prevState.posts.map((item) => {
          if (item.author.userId === prevState.posts[index].author.userId) {
            item.author.isFollowing = !item.author.isFollowing;
          }
          return item;
        }),
      };
    });

    //POST :- change the follow status of the author in the server
  }, []);

  const commentIconPressHandler = useCallback(
    (index: number) => {
      navigation.push("Comments", { postId: posts[index].id });
    },
    [navigation, posts]
  );

  const effectLabelPressHandler = useCallback(
    (effectId: string) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "Effect", params: { effectId } },
        },
      });
    },
    [navigation]
  );

  const hashtagPressHandler = useCallback(
    (hashtag: string) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "Hashtag", params: { hashtag } },
        },
      });
    },
    [navigation]
  );

  const likeCountPressHandler = useCallback(
    (index: number) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "PostLikes", params: { postId: posts[index].id } },
        },
      });
    },
    [navigation, posts]
  );

  const likeIconPressHandler = useCallback((index: number, value?: boolean) => {
    //change the isLiked state the target post
    setHomeFeedState((prevState) => {
      return {
        ...prevState,
        data: prevState.posts.map((item, itemIndex) => {
          if (itemIndex === index) {
            item.isLiked = value === true ? true : !item.isLiked;
          }
          return item;
        }),
      };
    });
    //TODO :- send a http request to sever to switch the state in the database
  }, []);

  const locationLabelPressHandler = useCallback(
    (locationId: string) => {
      navigation.push("MaterialTopTabs", {
        screen: "BottomTabs",
        params: {
          screen: "UtilityStacks",
          params: { screen: "Location", params: { locationId } },
        },
      });
    },
    [navigation]
  );
  const moreIconPressHandler = useCallback((index: number) => {
    toggleMoreOptionModalState();
    setSelectedPostIndex(index);
  }, []);

  const retryHandler = useCallback(() => {
    //resend the last failed http request
  }, []);

  const shareIconPressHandler = useCallback((index: number) => {}, []);

  const tagIconPressHandler = useCallback((index: number) => {
    setSelectedPostIndex(index);
    toggleTagModalOpenState();
  }, []);

  const toggleFullScreenState = useCallback(() => {}, []);

  const toggleMuteState = useCallback(() => {}, []);

  const { left, right } = useSafeAreaInsets();

  const contentWidth = SCREEN_WIDTH - left - right;

  useEffect(() => {
    setTimeout(async () => {
      const titleHeights = await TextSize.flatHeights({
        fontFamily: "roboto-medium",
        text: POST_DATA.map((item) => item.title),
        fontSize: SIZE_10,
        width: contentWidth - 2 * SIZE_5,
      });

      const metadata: PostMetadataParams[] = [];
      for (let i = 0; i < POST_DATA.length; i++) {
        const { height, lineCount } = await TextSize.measure({
          text: POST_DATA[i].author + " " + POST_DATA[i].caption,
          fontFamily: "roboto-regular",
          fontSize: SIZE_25,
          width: contentWidth - 2 * SIZE_5,
        });
        metadata.push({
          isCaptionExpanded: false,
          titleHeight: titleHeights[i],
          captionHeight: height,
          noOfLinesInCaption: lineCount,
        });
      }
      setHomeFeedState((prevState) => ({
        ...prevState,
        posts: [...POST_DATA],
        stories: [...ACCOUNT_DATA],
        hasMorePage: false,
        isLoading: false,
        postMetadata: metadata,
      }));
    }, 3000);
  }, []);

  const reportPost = useCallback(() => {
    if (scheduledReport !== "") {
      setScheduledReport("");
      startPopupAnimation();
    }
    setSelectedPostIndex(-1);
  }, [selectedPostIndex, scheduledReport]);

  const copyPostLink = useCallback(() => {
    setSelectedPostIndex(-1);
    startPopupAnimation();
  }, [selectedPostIndex]);

  const sharePostTo = useCallback(async () => {
    try {
      await Share.share({
        message: "http://localhost:5000/app/post/488335",
        url: "http://localhost:5000/app/post/488335",
      });
    } catch (error) {
    } finally {
      setSelectedPostIndex(-1);
    }
  }, [selectedPostIndex]);

  const savePost = useCallback(() => {
    setHomeFeedState((prevState) => {
      prevState.posts[selectedPostIndex].isSaved =
        !prevState.posts[selectedPostIndex].isSaved;
      return {
        ...prevState,
        data: [...prevState.posts],
      };
    });
    setSelectedPostIndex(-1);
    startPopupAnimation();
  }, [selectedPostIndex]);

  const removePost = useCallback(() => {
    if (removePostConfirmed) {
      setHomeFeedState((prevState) => ({
        ...prevState,
        posts: prevState.posts.filter(
          (_, itemIndex) => itemIndex !== selectedPostIndex
        ),
      }));
      setRemovePostConfirmed(false);
      startPopupAnimation();
    }

    setSelectedPostIndex(-1);
  }, [selectedPostIndex, removePostConfirmed]);

  const unfollowAuthor = useCallback(() => {
    if (unfollowConfirmed) {
      setHomeFeedState((prevState) => ({
        ...prevState,
        data: prevState.posts.filter((item) => {
          return (
            item.author.userId !==
            prevState.posts[selectedPostIndex].author.userId
          );
        }),
      }));
      setUnfollowConfirmed(true);
      startPopupAnimation();
    }

    setSelectedPostIndex(-1);
    setSelectedStoryIndex(-1);
  }, [selectedPostIndex, unfollowConfirmed, selectedStoryIndex]);

  const muteAuthor = useCallback(() => {
    if (scheduledMuteMode !== "") {
      setHomeFeedState((prevState) => ({
        ...prevState,
        data: prevState.posts.filter((item) => {
          return (
            item.author.userId !==
            prevState.posts[selectedPostIndex].author.userId
          );
        }),
      }));
      setScheduledMuteMode("");
      startPopupAnimation();
    }
    setSelectedPostIndex(-1);
    setSelectedStoryIndex(-1);
  }, [selectedPostIndex, scheduledMuteMode, selectedStoryIndex]);

  const addToFavourite = useCallback(() => {
    setSelectedPostIndex(-1);
    setSelectedStoryIndex(-1);
  }, []);

  const tagModalHeight =
    selectedPostIndex > -1
      ? Math.min(
          SIZE_35,
          ACCOUNT_LIST_ITEM_SIZE *
            posts[selectedPostIndex].taggedAccounts.length +
            2 * SIZE_4
        )
      : 0;

  const moreOptionModalHeigth = SIZE_32;

  const reportModalHeigth = SIZE_35;

  const selectedAuthorId =
    selectedPostIndex > -1
      ? " " + posts[selectedPostIndex].author.userId
      : selectedStoryIndex > -1
      ? " " + stories[selectedStoryIndex].userId
      : "";

  const Header = useCallback(
    () => (
      <StoryList
        accounts={stories}
        storyLoadingAccountId={loadingStoryAccountId}
        onTap={(index) => {
          setHomeFeedState((prevState) => ({
            ...prevState,
            loadingStoryAccountId: prevState.stories[index].userId,
          }));
        }}
        onDoubleTap={() => {}}
        onLongPress={(index) => {
          setSelectedStoryIndex(index);
          toggleStoryModalOpen();
        }}
      />
    ),
    [stories, loadingStoryAccountId]
  );

  const Footer = useCallback(() => {
    return (
      <View style={globalStyles.secondaryLightBackgroundColor}>
        <AppIcon
          name="tick"
          gap="medium"
          isBackgroundVisible
          background={COLOR_16}
          styleProp={[
            globalStyles.alignSelfCenter,
            globalStyles.marginTopSize4,
          ]}
        />
        <AppLabel
          text="You Are All Caught Up"
          size="extra-large"
          gap="large"
          foreground={COLOR_12}
        />
        <AppLabel
          text="You have seen all the unseen posts seens you were last online, switch to suggested posts or keep watching older posts"
          style="regular"
          noOfLines={4}
          alignment="center"
          gap="small"
          foreground={COLOR_12}
        />
        <Tappable
          type="overlay"
          onTap={() => {
            console.log("going to suggested posts screen");
          }}
        >
          <AppLabel
            text="Suggested Posts"
            isBackgroundVisible
            gap="large"
            style="bold"
          />
        </Tappable>
      </View>
    );
  }, []);

  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <FeedPostList
        data={posts}
        hasMorePages={hasMorePage}
        isError={isError}
        isFullScreen={false}
        isLoading={isLoading}
        isMuted={false}
        notify={notificationHandler}
        onAccountIdPress={accountIdPressHandler}
        onAudioLabelPress={audioLabelPressHandler}
        onAuthorAvatarPress={authorAvatarPressHandler}
        onAuthorFollowButtonPress={authorFollowButtonPressHandler}
        onCommentIconPress={commentIconPressHandler}
        onEffectLabelPress={effectLabelPressHandler}
        onHashtagPress={hashtagPressHandler}
        onLikeCountPress={likeCountPressHandler}
        onLikeIconPress={likeIconPressHandler}
        onLocationLabelPress={locationLabelPressHandler}
        onMoreIconPress={moreIconPressHandler}
        metadata={postMetadata}
        onCaptionPress={(index) => {
          if (postMetadata[index].isCaptionExpanded) {
            commentIconPressHandler(index);
          }
          setHomeFeedState((prevState) => ({
            ...prevState,
            postMetadata: prevState.postMetadata.map((item, itemIndex) => {
              if (itemIndex === index) {
                item.isCaptionExpanded = true;
              }
              return item;
            }),
          }));
        }}
        onRetry={retryHandler}
        onShareIconPress={shareIconPressHandler}
        onTagIconPress={tagIconPressHandler}
        showFollowButton={false}
        storyLoadingAccountId={loadingStoryAccountId}
        toggleFullScreenState={toggleFullScreenState}
        toggleMuteState={toggleMuteState}
        Header={Header}
        Footer={Footer}
      />
      <AppHeader
        LeftNode={() => (
          <Image
            source={require("../../assets/icons/logo.png")}
            style={[styles.logo, globalStyles.alignSelfCenter]}
            resizeMode="contain"
          />
        )}
        rightIcon={"search-bold"}
      />
      {/* more option modal */}
      <AppModal
        isVisible={isMoreOptionModalOpen}
        height={moreOptionModalHeigth}
        onDismiss={toggleMoreOptionModalState}
        afterClose={() => {
          switch (scheduledTask) {
            case "report":
              toggleReportModalOpenState();
              break;
            case "share":
              //TODO :- open native device modal to share to external apps
              sharePostTo();
              break;
            case "link":
              //TODO :- copy post link to clip board
              copyPostLink();
              break;
            case "unfollow":
              toggleUnfollowDialogBoxState();
              break;
            case "mute":
              togglePostMuteDialogBox();
              break;
            case "hide":
              togglePostHideDialogBoxState();
              break;
            case "save":
              savePost();
              break;
            case "favourite":
              addToFavourite();
              break;
          }
          setScheduledTask("");
        }}
      >
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.defaultBottomBorderWidth,
            globalStyles.primaryDarkBorderColor,
            globalStyles.flex1,
          ]}
        >
          <Tappable
            style={[
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              globalStyles.flex1,
            ]}
            type="animated"
            onTap={() => {
              setScheduledTask("report");
              setNotification("Post Reported");
              toggleMoreOptionModalState();
            }}
          >
            <AppIcon
              name="report"
              isBorderVisible
              foreground={COLOR_14}
              gap="medium"
            />
            <AppLabel text="Report" foreground={COLOR_14} gap="small" />
          </Tappable>
          <Tappable
            style={[
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              globalStyles.flex1,
            ]}
            type="animated"
            onTap={() => {
              setScheduledTask("link");
              setNotification("Link Copied");
              toggleMoreOptionModalState();
            }}
          >
            <AppIcon name="location" isBorderVisible gap="medium" />
            <AppLabel text="Copy Link" gap="small" />
          </Tappable>
          <Tappable
            style={[
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              globalStyles.flex1,
            ]}
            type="animated"
            onTap={() => {
              setScheduledTask("share");
              toggleMoreOptionModalState();
            }}
          >
            <AppIcon name="share-outline" isBorderVisible gap="medium" />
            <AppLabel text="Share to" gap="small" />
          </Tappable>
          <Tappable
            style={[
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
              globalStyles.flex1,
            ]}
            type="animated"
            onTap={() => {
              setScheduledTask("save");
              if (posts[selectedPostIndex].isSaved) {
                setNotification("Post unsaved");
              } else {
                setNotification("Post Saved");
              }
              toggleMoreOptionModalState();
            }}
          >
            <AppIcon
              name={
                selectedPostIndex > -1 && posts[selectedPostIndex].isSaved
                  ? "bookmark-solid"
                  : "bookmark-outline"
              }
              isBorderVisible
              gap="medium"
            />
            <AppLabel
              text={
                selectedPostIndex > -1 && posts[selectedPostIndex].isSaved
                  ? "Unsave"
                  : "Save"
              }
              gap="small"
            />
          </Tappable>
        </View>
        <Tappable
          type="underlay"
          onTap={() => {
            setScheduledTask("hide");
            setNotification("Post Removed");
            toggleMoreOptionModalState();
          }}
        >
          <AppLabel
            text="Hide"
            size="medium"
            style="regular"
            gap="large"
            alignment="left"
          />
        </Tappable>
        <Tappable
          type="underlay"
          onTap={() => {
            setScheduledTask("unfollow");
            setNotification(
              "Unfollowed" +
                (selectedPostIndex === -1
                  ? ""
                  : " " + posts[selectedPostIndex].author.userId)
            );
            toggleMoreOptionModalState();
          }}
        >
          <AppLabel
            text="unfollow"
            size="medium"
            style="regular"
            gap="large"
            alignment="left"
          />
        </Tappable>
        <Tappable
          type="underlay"
          onTap={() => {
            setScheduledTask("favourite");
            toggleMoreOptionModalState();
          }}
        >
          <AppLabel
            text="Add to favourites"
            size="medium"
            style="regular"
            gap="large"
            alignment="left"
          />
        </Tappable>
        <Tappable
          type="underlay"
          onTap={() => {
            setScheduledTask("mute");
            setNotification(
              "Muted" +
                (selectedPostIndex === -1
                  ? ""
                  : " " + posts[selectedPostIndex].author.userId)
            );
            toggleMoreOptionModalState();
          }}
        >
          <AppLabel
            text="Mute"
            size="medium"
            style="regular"
            gap="large"
            alignment="left"
          />
        </Tappable>
      </AppModal>
      {/* report post modal*/}
      <AppModal
        height={reportModalHeigth}
        isVisible={isReportModalOpen}
        onDismiss={toggleReportModalOpenState}
        afterClose={reportPost}
      >
        <View
          style={[
            globalStyles.alignStart,
            styles.horizontalPaddingSamll,
            globalStyles.paddingVerticalSize4,
          ]}
        >
          <AppLabel
            text={"Why are you reporting this post ?"}
            size="medium"
            foreground={COLOR_7}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={globalStyles.paddingVerticalSize4}
          nestedScrollEnabled={true}
        >
          {REPORT_REASONS.map((item) => (
            <Tappable
              type="underlay"
              key={item}
              style={[
                globalStyles.alignStart,
                styles.horizontalPaddingSamll,
                globalStyles.paddingVerticalSize4,
              ]}
              onTap={() => {
                setScheduledReport(item);
                toggleReportModalOpenState();
              }}
            >
              <AppLabel text={item} size="medium" style="regular" />
            </Tappable>
          ))}
        </ScrollView>
      </AppModal>
      {/* tag account modal */}
      <AppModal
        height={tagModalHeight}
        isVisible={isTagModalOpen}
        onDismiss={toggleTagModalOpenState}
      >
        <AccountList
          accounts={
            selectedPostIndex > -1
              ? posts[selectedPostIndex].taggedAccounts
              : []
          }
          renderLeftNode={(item, index) => {
            return (
              <Tappable
                type="overlay"
                onTap={() => {
                  console.log("going to follow/unfollow index ", index);
                }}
                style={{ width: "100%" }}
              >
                <AppLabel
                  text={item.isFollowing ? "following" : "follow"}
                  isBorderVisible={item.isFollowing}
                  isBackgroundVisible={!item.isFollowing}
                  foreground={item.isFollowing ? COLOR_7 : COLOR_8}
                  background={item.isFollowing ? "transparent" : COLOR_1}
                  gap="medium"
                  corner="small-round"
                />
              </Tappable>
            );
          }}
        />
      </AppModal>
      <AppModal
        height={120}
        isVisible={isStoryModalOpen}
        onDismiss={toggleStoryModalOpen}
        afterClose={() => {
          if (scheduledTask !== "") {
            switch (scheduledTask) {
              case "favourite":
                addToFavourite();
                break;
              case "mute":
                togglePostMuteDialogBox();
                break;
              case "unfollow":
                toggleUnfollowDialogBoxState();
                break;
            }
            setScheduledTask("");
          } else {
            setSelectedStoryIndex(-1);
          }
        }}
      >
        <TouchableHighlight
          activeOpacity={1.0}
          underlayColor={COLOR_13}
          onPress={() => {
            setScheduledTask("unfollow");
            toggleStoryModalOpen();
          }}
        >
          <AppLabel
            text="Unfollow"
            gap="large"
            size="medium"
            style="regular"
            alignment="left"
          />
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1.0}
          underlayColor={COLOR_13}
          onPress={() => {
            setScheduledTask("favourite");
            toggleStoryModalOpen();
          }}
        >
          <AppLabel
            text="Add to favourite"
            gap="large"
            size="medium"
            style="regular"
            alignment="left"
          />
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1.0}
          underlayColor={COLOR_13}
          onPress={() => {
            setScheduledTask("mute");
            toggleStoryModalOpen();
          }}
        >
          <AppLabel
            text="Mute"
            gap="large"
            size="medium"
            style="regular"
            alignment="left"
          />
        </TouchableHighlight>
      </AppModal>
      {/* author mute dialogbox */}
      <AppDialogBox
        isVisible={isPostMuteDialogBoxOpen}
        onDismiss={togglePostMuteDialogBox}
        afterClose={muteAuthor}
        options={[
          {
            label: selectedPostIndex === -1 ? "Mute story" : "Mute post",
            onPress: () => {
              setScheduledMuteMode(selectedPostIndex === -1 ? "story" : "post");
              togglePostMuteDialogBox();
            },
            color: COLOR_14,
          },
          {
            label:
              selectedPostIndex === -1
                ? "Mute story and post"
                : "Mute post and story",
            onPress: () => {
              setScheduledMuteMode("all");
              togglePostMuteDialogBox();
            },
            color: COLOR_14,
          },
          {
            label: "Cancel",
            onPress: () => {
              setSelectedPostIndex(-1);
              togglePostMuteDialogBox();
            },
            color: COLOR_7,
          },
        ]}
        title={"Mute" + selectedAuthorId}
        info="post from this author will not be shown in the feed author will not be notified that you have muted them"
      ></AppDialogBox>
      {/* post hide dialogbox */}
      <AppDialogBox
        isVisible={isPostHideDialogBoxOpen}
        onDismiss={togglePostHideDialogBoxState}
        afterClose={removePost}
        options={[
          {
            label: "Confirm",
            onPress: () => {
              setRemovePostConfirmed(true);
              togglePostHideDialogBoxState();
            },
            color: COLOR_14,
          },
          {
            label: "Cancel",
            onPress: () => {
              setSelectedPostIndex(-1);
              togglePostHideDialogBoxState();
            },
          },
        ]}
        title="Remove Post"
        info="post from this author will be shown down in the feed"
      ></AppDialogBox>
      {/* unfollow dialogbox */}
      <AppDialogBox
        isVisible={isUnfollowDialogBoxOpen}
        onDismiss={toggleUnfollowDialogBoxState}
        afterClose={unfollowAuthor}
        options={[
          {
            label: "Confirm",
            onPress: () => {
              setUnfollowConfirmed(true);
              toggleUnfollowDialogBoxState();
            },
            color: COLOR_14,
          },
          {
            label: "Cancel",
            onPress: () => {
              setSelectedPostIndex(-1);
              toggleUnfollowDialogBoxState();
            },
          },
        ]}
        title={"Unfollow" + selectedAuthorId}
        info={"do you really want to unfollow this account"}
      ></AppDialogBox>
      <Animated.View
        style={[
          globalStyles.absolutePosition,
          globalStyles.alignSelfCenter,
          { bottom: 72 },
          popupAnimatedStyle,
        ]}
      >
        <AppLabel
          text={notification}
          isBackgroundVisible
          background="rgba(0, 0, 0, 0.8)"
          gap="medium"
          size="extra-small"
          style="bold"
          corner="small-round"
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: { height: SIZE_14, width: SIZE_31 },
  moreOptionModal: {
    height: SIZE_32,
  },
  reportModal: {
    height: SIZE_33,
  },

  horizontalPaddingSamll: {
    paddingHorizontal: SIZE_5,
  },
  marginLeftExtraSmall: {
    marginLeft: SIZE_4,
  },
  marginLeftSmall: {
    marginLeft: SIZE_5,
  },
  marginTopSmall: {
    marginTop: SIZE_5,
  },
  marginRightSmall: {
    marginRight: SIZE_5,
  },
  reasonLabel: {
    maxWidth: "90%",
  },
  hiddenPostFallbackContainer: { height: SIZE_32, backgroundColor: COLOR_13 },
});
