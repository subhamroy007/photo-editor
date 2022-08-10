import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EntityState } from "@reduxjs/toolkit";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectAccountById } from "../../../api/accounts/accountSlice";

import { selectProfilePicuture } from "../../../api/global/appSelector";
import { useGetStoriesQuery } from "../../../api/storeApi";
import {
  COLOR_10,
  COLOR_5,
  SIZE_4,
  SIZE_5,
} from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import {
  AccountGlobalParams,
  AppSliceState,
  CommentGlobalParams,
  CommentResponse,
  RootStackNavigatorParams,
} from "../../../constants/types";
import {
  getCountString,
  getTimeElapsedString,
} from "../../../constants/utility";
import { useSpringAnimation } from "../../../hooks/useSpringAnimation";
import { useStoreDispatch } from "../../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppIcon } from "../../utility/AppIcon";
import { AppLabel } from "../../utility/AppLabel";
import { AppPressable } from "../../utility/AppPressable";
import { HighlightedText } from "../../utility/HighlightedText";

export const CommentListItem = React.memo<CommentListItemProps>(
  (props) => {
    const { comment, replyTo, onSelect, type } = props;

    const renderTimeStamp = useRef(Date.now()).current;

    const [skipStoryLoadingRequest, setSkipStoryLoadingRequest] =
      useState(true);

    const {
      isError: isStoryLoadingFailed,
      isSuccess: isStoryLoadingSuccessed,
      isLoading: isStoryLoading,
      currentData,
    } = useGetStoriesQuery(comment.author.userid, {
      skip: skipStoryLoadingRequest,
    });

    const { springAnimationStyle, startSpringAnimation } = useSpringAnimation();

    //selector to select the current comment global params from the store
    const selectCommentFromStore = useCallback(
      (state: {
        app: AppSliceState;
        comment: EntityState<
          CacheEntityParams<CommentGlobalParams, { isPosted: boolean }>
        >;
      }) => {
        return selectCommentById(state.comment, comment.id);
      },
      [comment]
    );

    //selector to select the current comment author global params from the store
    const selectAccountFromStore = useCallback(
      (state: {
        app: AppSliceState;
        account: EntityState<
          CacheEntityParams<AccountGlobalParams, { isStoryLoading: boolean }>
        >;
      }) => {
        return selectAccountById(state.account, comment.author.id);
      },
      [comment]
    );

    //global params of the current comment
    const globalCommentParams = useStoreSelector(
      selectCommentFromStore,
      shallowEqual
    );

    //global params of the author of the comment
    const globalAuthorParams = useStoreSelector(
      selectAccountFromStore,
      shallowEqual
    );

    //create the target comment from the current comment params and global params
    const targetComment = useMemo<CommentResponse>(() => {
      let result = { ...comment };
      if (
        globalCommentParams &&
        globalCommentParams.meta.lastModifiedTimestamp > renderTimeStamp
      ) {
        result = {
          ...result,
          ...globalCommentParams.data,
        };
      }
      if (
        globalAuthorParams &&
        globalAuthorParams.meta.lastModifiedTimestamp > renderTimeStamp
      ) {
        result.author = {
          ...result.author,
          ...globalAuthorParams.data,
        };
      }

      return result;
    }, [globalCommentParams, globalAuthorParams]);

    const profilePicture = useStoreSelector(selectProfilePicuture);

    const dispatch = useStoreDispatch();

    const navigation =
      useNavigation<
        NativeStackScreenProps<RootStackNavigatorParams>["navigation"]
      >();

    const replyPressHandler = useCallback(() => {
      if (!type || type === "comment") {
        navigation.push("Reply", { commentId: targetComment.id });
      } else if (type === "reply") {
        replyTo!();
      }
    }, [navigation, targetComment]);

    const likeCountPressHandler = useCallback(() => {
      if (!type || type === "comment") {
        navigation.push("MaterialTopTabs", {
          screen: "BottomTabs",
          params: {
            screen: "UtilityStacks",
            params: {
              screen: "CommentLikes",
              params: { commentId: targetComment.id },
            },
          },
        });
      } else if (type === "reply") {
        navigation.push("MaterialTopTabs", {
          screen: "BottomTabs",
          params: {
            screen: "UtilityStacks",
            params: {
              screen: "ReplyLikes",
              params: { replyId: targetComment.id },
            },
          },
        });
      }
    }, [navigation]);

    const likeIconPressHandler = useCallback(
      (value?: boolean) => {
        if (type !== "header") {
          startSpringAnimation();
          if (
            !globalCommentParams ||
            globalCommentParams.meta.lastModifiedTimestamp < renderTimeStamp
          ) {
            dispatch(addCommentToStore({ ...targetComment }));
          }
          dispatch(toggleCommentLikeState(targetComment.id, value));
        }
      },
      [targetComment, globalCommentParams]
    );

    const avatarPressHandler = useCallback(() => {
      if (targetComment.author.noOfUnseenStories > 0) {
        if (!globalAuthorParams) {
          dispatch(
            addAccountToStore({ ...targetComment.author, stories: [] }, true)
          );
          setSkipStoryLoadingRequest(false);
        } else {
          if (!globalAuthorParams.meta.isStoryLoading) {
            if (globalAuthorParams.data.stories.length === 0) {
              setSkipStoryLoadingRequest(false);
            } else {
              console.log("going to story screen");
            }
          }
        }
      } else {
        gotoProfile(targetComment.author.userid);
      }
    }, [targetComment, globalAuthorParams]);

    const gotoHashtag = useCallback(
      (hashtag: string) => {
        navigation.push("MaterialTopTabs", {
          screen: "BottomTabs",
          params: {
            screen: "UtilityStacks",
            params: {
              screen: "Hashtag",
              params: { hashtag },
            },
          },
        });
      },
      [navigation]
    );

    const gotoProfile = useCallback(
      (accountId: string) => {
        navigation.push("MaterialTopTabs", {
          screen: "BottomTabs",
          params: {
            screen: "UtilityStacks",
            params: {
              screen: "Profile",
              params: { userid: accountId },
            },
          },
        });
      },
      [navigation]
    );

    useEffect(() => {
      if (isStoryLoadingSuccessed) {
        console.log("going to story screen");
      }
    }, [isStoryLoadingSuccessed]);

    return (
      <AppPressable
        style={[
          globalStyles.paddingHorizontalSize4,
          globalStyles.paddingVerticalSize4,
        ]}
        onLongPress={onSelect}
        onDoubleTap={() => {
          likeIconPressHandler(true);
        }}
        onPress={replyPressHandler}
        disabled={type === "header"}
      >
        <View style={[globalStyles.flexRow, globalStyles.alignStart]}>
          <Pressable
            onPress={avatarPressHandler}
            android_disableSound
            hitSlop={SIZE_5}
          >
            <AppAvatar
              image={
                targetComment.author.profilePicture.length
                  ? targetComment.author.profilePicture[0]
                  : profilePicture
              }
              hasRing={targetComment.author.noOfUnseenStories > 0}
              isActive={targetComment.author.noOfUnseenStories > 0}
              isAnimated={!skipStoryLoadingRequest && isStoryLoading}
              size={"medium"}
            />
          </Pressable>
          <Text style={[globalStyles.flex1, globalStyles.marginLeftSize4]}>
            <AppLabel
              text={targetComment.author.userid}
              noOfLines={2}
              onPress={() => {
                gotoProfile(targetComment.author.userid);
              }}
            />{" "}
            <AppText
              text={targetComment.content}
              isExpanded
              onAccountIdPress={gotoProfile}
              onHashtagPress={gotoHashtag}
            />
          </Text>
        </View>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignCenter,
            globalStyles.marginTopSize4,
          ]}
        >
          <AppLabel
            text={getTimeElapsedString(targetComment.timestamp)}
            size="extra-small"
            style="bold"
            foreground={COLOR_5}
          />
          {type !== "header" && (
            <>
              {targetComment.noOfLikes > 0 && (
                <Pressable
                  onPress={likeCountPressHandler}
                  android_disableSound
                  hitSlop={SIZE_5}
                  style={globalStyles.marginLeftSize4}
                >
                  <AppLabel
                    text={
                      targetComment.noOfLikes === 1
                        ? "1 like"
                        : getCountString(targetComment.noOfLikes) + " likes"
                    }
                    size={"extra-small"}
                    foreground={COLOR_5}
                    style="bold"
                  />
                </Pressable>
              )}
              <Pressable
                onPress={replyPressHandler}
                android_disableSound
                hitSlop={SIZE_5}
                style={globalStyles.marginLeftSize4}
              >
                <AppLabel
                  text={
                    targetComment.noOfReplies === 0
                      ? "Reply"
                      : getCountString(targetComment.noOfReplies) + " Reply"
                  }
                  size={"extra-small"}
                  foreground={COLOR_5}
                  style="bold"
                />
              </Pressable>
              <AppPressable
                onPress={likeIconPressHandler}
                hitSlop={SIZE_5}
                animatedStyle={springAnimationStyle}
                style={[{ marginLeft: "auto" }]}
              >
                {targetComment.isLiked ? (
                  <AppIcon
                    name="heart-solid"
                    size="small"
                    foreground={COLOR_10}
                  />
                ) : (
                  <AppIcon name="heart-outline" size="small" />
                )}
              </AppPressable>
            </>
          )}
        </View>
      </AppPressable>
    );
  },
  () => {
    return true;
  }
);
