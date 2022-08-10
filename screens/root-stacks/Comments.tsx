import { useKeyboard } from "@react-native-community/hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Pressable,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TextSize from "react-native-text-size";
import { shallowEqual } from "react-redux";
import {
  selectAccountId,
  selectProfilePicuture,
} from "../../api/global/appSelector";
import { useGetCommentsQuery } from "../../api/storeApi";
import { CommentListItem } from "../../components/post/comment/CommentListItem";
import { AppAvatar } from "../../components/utility/AppAvatar";
import { AppDialogBox } from "../../components/utility/AppDialogBox";
import { AppHeader } from "../../components/utility/AppHeader";
import { AppIcon } from "../../components/utility/AppIcon";
import { AppLabel } from "../../components/utility/AppLabel";
import { AppLoadingIndicator } from "../../components/utility/AppLoadingIndicator";
import { AppModal } from "../../components/utility/AppModal";
import { AppPressable } from "../../components/utility/AppPressable";
import {
  COLOR_14,
  COLOR_5,
  HEADER_HEIGHT,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SIZE_1,
  SIZE_15,
  SIZE_21,
  SIZE_25,
  SIZE_31,
  SIZE_4,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  CommentListItemParams,
  CommentResponse,
  RootStackNavigatorParams,
} from "../../constants/types";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export type CommentScreenStateParams = {
  data: {
    post: CommentResponse | null;
    comments: CommentListItemParams[];
  };
  meta: {
    offset: number;
    timestamp: number;
    hasMorePages: boolean;
  };
};

export function Comments({
  navigation,
  route: {
    params: { postId },
  },
}: CommentsNavigationParams) {
  useStatusBar();

  const {
    isError,
    isFetching,
    isLoading,
    isSuccess,
    refetch: retryGetComments,
    currentData,
  } = useGetCommentsQuery(postId);

  const inputRef = useRef<TextInput | null>(null);

  const [inputText, setInputText] = useState("");

  const [isSearchResultVisible, setSearchResultVisible] = useState(false);

  const profilePicture = useStoreSelector(selectProfilePicuture, shallowEqual);
  const accountId = useStoreSelector(selectAccountId);

  const dispatch = useStoreDispatch();

  const [searchPhase, setSearchPhase] = useState("");

  const [commentScreenState, setCommentScreenState] =
    useState<CommentScreenStateParams>({
      data: {
        comments: [],
        post: null,
      },
      meta: {
        offset: 0,
        timestamp: Date.now(),
        hasMorePages: true,
      },
    });

  const [blockState, setBlockState] = useState<{
    isModalOpen: boolean;
    isConfirmed: boolean;
  }>({ isConfirmed: false, isModalOpen: false });

  const toggleBlockDialogBoxOpen = useCallback(() => {
    setBlockState((prevState) => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen,
    }));
  }, []);

  const [moreOptionState, setMoreOptionState] = useState<{
    isModalOpen: boolean;
    scheduledTask?: "block" | "report" | "delete";
    selectedCommentId?: string;
  }>({ isModalOpen: false });

  const toggleMoreOptionModal = useCallback(() => {
    setMoreOptionState((prevState) => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen,
    }));
  }, []);

  const changeSelectedCommentId = useCallback((id?: string) => {
    setMoreOptionState((prevState) => ({
      ...prevState,
      selectedCommentId: id,
    }));
  }, []);

  const { left, right, top } = useSafeAreaInsets();

  const changeTextHandler = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const inputEnabled = isSuccess && inputText.trim().length > 0;

  const { keyboardHeight, keyboardShown } = useKeyboard();

  const searchResultListHeight =
    SCREEN_HEIGHT - keyboardHeight - (SIZE_15 + 2 * SIZE_4);

  useEffect(() => {
    const prepare = async () => {
      if (isSuccess && currentData) {
        //calculate the heights of the individual new comments
        const newComments = (
          await TextSize.flatHeights({
            text: currentData.data.comments.map(
              (item) => item.author.userid + " " + item.content
            ),
            fontFamily: "roboto-regular",
            fontSize: SIZE_25,
            width: SCREEN_WIDTH - left - right - 3 * SIZE_5 - SIZE_21,
          })
        ).map<CommentListItemParams>((item, index) => ({
          contentHeight: item,
          ...currentData.data.comments[index],
        }));

        //set the details the the state
        setCommentScreenState((prevState) => {
          return {
            ...prevState,
            meta: {
              ...prevState.meta,
              offset: currentData.data.comments.length + prevState.meta.offset,
            },
            data: {
              post: currentData.data.post
                ? currentData.data.post
                : prevState.data.post,
              comments: [...prevState.data.comments, ...newComments],
            },
          };
        });
      }
    };
    prepare();
  }, [isSuccess, currentData]);

  useEffect(() => {
    if (!keyboardShown) {
      setSearchResultVisible(false);
      inputRef.current?.blur();
    }
  }, [keyboardShown]);

  useEffect(() => {
    if (moreOptionState.selectedCommentId) {
      toggleMoreOptionModal();
    }
  }, [moreOptionState.selectedCommentId]);

  const renderComments = useCallback(
    ({ item }: ListRenderItemInfo<CommentListItemParams>) => {
      return (
        <CommentListItem
          comment={item}
          onSelect={() => {
            changeSelectedCommentId(item.id);
          }}
        />
      );
    },
    []
  );

  const getCommentLayout = useCallback(
    (data: CommentListItemParams[] | null | undefined, index: number) => {
      const height = data
        ? 3 * SIZE_5 + SIZE_6 + Math.max(data[index].contentHeight, SIZE_15)
        : 0;
      return {
        index,
        length: height,
        offset: height * index,
      };
    },
    []
  );

  const listEmptyComponent = useCallback(() => {
    return (
      <View
        style={[
          globalStyles.alignCenter,
          {
            marginTop: isSuccess
              ? SCREEN_WIDTH / 2 - HEADER_HEIGHT
              : SCREEN_HEIGHT / 2 - top - HEADER_HEIGHT - SIZE_9,
          },
        ]}
      >
        {isLoading && <AppLoadingIndicator color={COLOR_5} />}
        {isError && (
          <Pressable android_disableSound onPress={retryGetComments}>
            <AppIcon
              name="undo"
              gap="medium"
              foreground={COLOR_5}
              borderVisible
            />
          </Pressable>
        )}
        {isSuccess && (
          <>
            <AppIcon
              name="comment-outline"
              borderVisible
              size="large"
              gap="small"
            />
            <AppLabel
              text="no comments yet"
              size="extra-large"
              style="bold"
              styleProp={globalStyles.marginTopSize4}
            />
          </>
        )}
      </View>
    );
  }, [isLoading, isError, isSuccess]);

  const listFooterComponent = useCallback(() => {
    return commentScreenState.meta.hasMorePages &&
      commentScreenState.data.comments.length ? (
      <View
        style={[
          globalStyles.alignCenter,
          globalStyles.paddingVerticalSize4,
          globalStyles.marginBottomSize4,
        ]}
      >
        {!isError ? (
          <AppLoadingIndicator color={COLOR_5} />
        ) : (
          <Pressable android_disableSound onPress={retryGetComments}>
            <AppIcon
              name="undo"
              gap="medium"
              foreground={COLOR_5}
              borderVisible
            />
          </Pressable>
        )}
      </View>
    ) : null;
  }, [
    commentScreenState.meta.hasMorePages,
    isError,
    commentScreenState.data.comments,
  ]);

  const listHeaderComponent = useCallback(() => {
    return commentScreenState.data.post ? (
      <View
        style={[
          globalStyles.primaryBottomBorderWidth,
          globalStyles.primaryDarkBorderColor,
        ]}
      >
        <CommentListItem comment={commentScreenState.data.post} type="header" />
        <AppLabel
          text="568384 Comments"
          foreground={COLOR_5}
          size="medium"
          styleProp={[
            globalStyles.marginBottomSize4,
            globalStyles.alignSelfCenter,
          ]}
        />
      </View>
    ) : null;
  }, [commentScreenState.data.post]);

  const selectedCommentAuthorId = useMemo(() => {
    if (!moreOptionState.selectedCommentId) {
      return "";
    }

    const selectedComment = commentScreenState.data.comments.find(
      (item) => item.id === moreOptionState.selectedCommentId
    );

    return selectedComment ? selectedComment.author.userid : "";
  }, [moreOptionState.selectedCommentId, commentScreenState]);

  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <FlatList
        data={commentScreenState.data.comments}
        extraData={commentScreenState}
        showsVerticalScrollIndicator={false}
        renderItem={renderComments}
        getItemLayout={getCommentLayout}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      />
      <KeyboardAvoidingView
        style={[
          globalStyles.flexRow,
          globalStyles.paddingVerticalSize2,
          globalStyles.paddingHorizontalSize4,
          globalStyles.primaryDarkBorderColor,
          globalStyles.primaryTopBorderWidth,
        ]}
      >
        <AppAvatar
          image={profilePicture}
          size="medium"
          styleProp={globalStyles.alignSelfCenter}
        />

        <TextInput
          ref={inputRef}
          onChangeText={changeTextHandler}
          onTextInput={({ nativeEvent: { text } }) => {
            const targetText = text.trim();
            if (targetText === "") {
              setSearchResultVisible(false);
            } else if (targetText === "#") {
              setSearchResultVisible(false);
            } else if (targetText === "@") {
              setSearchResultVisible(false);
            } else {
              const hashtagIndex = targetText.indexOf("#");
              const accountIndex = targetText.lastIndexOf("@");
              if (hashtagIndex > -1 && accountIndex === -1) {
                setSearchResultVisible(true);
                setSearchPhase(targetText);
              } else if (
                accountIndex > -1 &&
                accountIndex < targetText.length - 1
              ) {
                setSearchResultVisible(true);
                setSearchPhase(targetText.slice(accountIndex + 1));
              } else {
                setSearchResultVisible(false);
              }
            }
          }}
          value={inputText}
          style={[
            globalStyles.flex1,
            globalStyles.marginLeftSize4,
            globalStyles.marginRightSize4,
            {
              maxHeight: SIZE_1,
            },
          ]}
          placeholder="Leave a comment..."
          multiline={true}
        />
        <Pressable
          android_disableSound
          hitSlop={SIZE_5}
          style={[
            globalStyles.alignSelfCenter,
            {
              opacity: inputEnabled ? 1.0 : 0.8,
            },
          ]}
          onPress={() => {}}
          disabled={!inputEnabled}
        >
          <AppLabel
            text="Post"
            backgroundVisible
            gapVertical="small"
            corner="small-round"
            gapHorizontal="large"
          />
        </Pressable>
      </KeyboardAvoidingView>
      <AppModal
        height={SIZE_31}
        isVisible={moreOptionState.isModalOpen}
        onDismiss={toggleMoreOptionModal}
        afterClose={() => {
          if (moreOptionState.scheduledTask) {
            switch (moreOptionState.scheduledTask) {
              case "block":
                toggleBlockDialogBoxOpen();
                break;
              case "report":
                changeSelectedCommentId();
                break;
            }
            setMoreOptionState((prevState) => ({
              ...prevState,
              scheduledTask: undefined,
            }));
          } else {
            changeSelectedCommentId();
          }
        }}
      >
        <View style={[globalStyles.flexRow, globalStyles.flex1]}>
          <AppPressable
            type="animated"
            style={[
              globalStyles.alignCenter,
              globalStyles.justifyCenter,
              globalStyles.flex1,
            ]}
            onPress={() => {
              setMoreOptionState((prevState) => ({
                ...prevState,
                scheduledTask: "report",
              }));
              toggleMoreOptionModal();
            }}
          >
            <AppIcon
              name="report"
              borderVisible
              foreground={COLOR_14}
              gap="large"
            />
            <AppLabel
              text="Report"
              foreground={COLOR_14}
              styleProp={globalStyles.marginTopSize4}
            />
          </AppPressable>
          <AppPressable
            type="animated"
            style={[
              globalStyles.alignCenter,
              globalStyles.justifyCenter,
              globalStyles.flex1,
            ]}
            onPress={() => {
              setMoreOptionState((prevState) => ({
                ...prevState,
                scheduledTask: "block",
              }));
              toggleMoreOptionModal();
            }}
          >
            <AppIcon name="info" borderVisible gap="large" />
            <AppLabel text="Block" styleProp={globalStyles.marginTopSize4} />
          </AppPressable>
        </View>
      </AppModal>
      <AppDialogBox
        isVisible={blockState.isModalOpen}
        onDismiss={toggleBlockDialogBoxOpen}
        title={`Unfollow ${selectedCommentAuthorId}`}
        info="the will not be able to find you in the app, cannot follow you or react to your post"
        options={[
          {
            label: "Confirm",
            color: COLOR_14,
            onPress: () => {
              setBlockState((prevState) => ({
                ...prevState,
                isConfirmed: true,
              }));
              toggleBlockDialogBoxOpen();
            },
          },
          {
            label: "Cancel",
            onPress: () => {
              toggleBlockDialogBoxOpen();
            },
          },
        ]}
        afterClose={() => {
          if (blockState.isConfirmed) {
            setCommentScreenState((prevState) => ({
              ...prevState,
              data: {
                ...prevState.data,
                comments: prevState.data.comments.filter(
                  (item) => item.id !== moreOptionState.selectedCommentId
                ),
              },
            }));
            setBlockState((prevState) => ({
              ...prevState,
              isConfirmed: false,
            }));
          }
          changeSelectedCommentId();
        }}
      />
    </SafeAreaView>
  );
}
