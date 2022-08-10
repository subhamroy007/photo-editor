import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLOR_5,
  HEADER_HEIGHT,
  SCREEN_HEIGHT,
  SIZE_15,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import {
  AccountResponse,
  CommentListItemParams,
  CommentResponse,
} from "../../../constants/types";
import { AppIcon } from "../../utility/AppIcon";
import { AppLabel } from "../../utility/AppLabel";
import { AppLoadingIndicator } from "../../utility/AppLoadingIndicator";
import { CommentListItem } from "./CommentListItem";

export type CommentListProps = {
  data: {
    caption: string;
    timestamp: number;
    author: AccountResponse;
    comments: CommentListItemParams[];
    noOfComments: number;
  } | null;
  onLongPress: (commentId: string) => void;
  onRetry: () => void;
  isLoading: boolean;
  isError: boolean;
  hasMorePages: boolean;
};

export function CommentList({
  onLongPress,
  hasMorePages,
  isError,
  isLoading,
  onRetry,
  data,
}: CommentListProps) {
  const { top } = useSafeAreaInsets();

  const renderComments = useCallback(
    ({ item }: ListRenderItemInfo<CommentResponse>) => {
      return (
        <CommentListItem
          comment={item}
          onLongPress={onLongPress}
          replyTo={() => {}}
          readonly={false}
        />
      );
    },
    []
  );

  const listEmpty = useCallback(() => {
    return (
      <View
        style={[
          globalStyles.alignCenter,
          { marginTop: SCREEN_HEIGHT / 2 - top - HEADER_HEIGHT - SIZE_9 },
        ]}
      >
        {isLoading ? (
          <AppLoadingIndicator color={COLOR_5} />
        ) : isError ? (
          <Pressable hitSlop={SIZE_6} onPress={onRetry}>
            <AppIcon
              name="undo"
              gap="medium"
              foreground={COLOR_5}
              borderVisible
            />
          </Pressable>
        ) : null}
      </View>
    );
  }, [isLoading, isError]);

  const listFooter = useCallback(() => {
    return (
      <View
        style={[globalStyles.alignCenter, globalStyles.paddingVerticalSize7]}
      >
        {hasMorePages && data ? (
          !isError ? (
            <AppLoadingIndicator
              color={COLOR_5}
              style={globalStyles.marginBottomSize4}
            />
          ) : (
            <Pressable
              hitSlop={SIZE_6}
              onPress={onRetry}
              style={globalStyles.marginBottomSize4}
            >
              <AppIcon
                name="undo"
                gap="medium"
                foreground={COLOR_5}
                borderVisible
              />
            </Pressable>
          )
        ) : null}
      </View>
    );
  }, [hasMorePages, isError, data]);

  const getItemLayout = useCallback(
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

  const listHeader = useCallback(() => {
    return data ? (
      <View
        style={[
          globalStyles.primaryBottomBorderWidth,
          globalStyles.primaryDarkBorderColor,
        ]}
      >
        <CommentListItem
          comment={{
            author: data.author,
            content: data.caption,
            timestamp: data.timestamp,
            id: "",
            isLiked: false,
            isReply: false,
            noOfLikes: -1,
            noOfReplies: -1,
          }}
          readonly
        />
        {data.noOfComments && (
          <AppLabel
            text={data.noOfComments + " Comments"}
            foreground={COLOR_5}
            size="medium"
            gapVertical="small"
            styleProp={globalStyles.marginBottomSize4}
          />
        )}
      </View>
    ) : null;
  }, [data]);

  return (
    <FlatList
      data={data?.comments}
      renderItem={renderComments}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
      ListEmptyComponent={listEmpty}
      ListFooterComponent={listFooter}
      ListHeaderComponent={listHeader}
      getItemLayout={getItemLayout}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
    />
  );
}
