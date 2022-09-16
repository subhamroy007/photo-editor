import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  ListRenderItemInfo,
  View,
} from "react-native";
import { shallowEqual, useDispatch } from "react-redux";
import { storeAccounts } from "../../../api/accounts/accountSlice";
import { selectCommentIds } from "../../../api/post/postSelector";
import { storeComments } from "../../../api/post/postSlice";
import { useGetCommentsQuery } from "../../../api/storeApi";
import { LAYOUT_ANIMATION_DURATION_MS } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountResponse } from "../../../constants/types";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Label } from "../../utility/Label";
import { CommentListItem } from "./CommentListItem";

export type CommentListProps = {
  id: string;
  gotoHashtag: (name: string) => void;
  gotoAccount: (userid: string) => void;
};

export function CommentList({
  gotoAccount,
  gotoHashtag,
  id,
}: CommentListProps) {
  const [commentState, setCommentState] = useState<{
    offset: number;
    timestamp: number;
    skipRequest: boolean;
  }>({
    offset: 0,
    timestamp: Date.now(),
    skipRequest: false,
  });

  const {
    isError: isCommentError,
    isFetching: isCommentFetching,
    isLoading: isCommentLoading,
    isSuccess: isCommentSuccess,
    refetch: retry,
    currentData,
  } = useGetCommentsQuery(
    {
      offset: commentState.offset,
      postId: id,
      timestamp: commentState.timestamp,
    },
    { skip: commentState.skipRequest, refetchOnMountOrArgChange: true }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isCommentSuccess && currentData) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(LAYOUT_ANIMATION_DURATION_MS, "linear", "scaleY")
      );
      setCommentState((prevState) => ({
        ...prevState,
        offset: prevState.offset + currentData.data.comments.length,
        skipRequest: true,
      }));
      const accounts: AccountResponse[] = [];

      currentData.data.comments.forEach((comment) => {
        accounts.push(comment.author);
        accounts.push(...comment.replies.map((reply) => reply.author));
        dispatch(storeAccounts(accounts));
        dispatch(storeComments(id, currentData.data.comments, false, true));
      });
    }
  }, [isCommentSuccess, currentData]);

  const getComments = useCallback((state) => selectCommentIds(state, id), [id]);

  const comments = useStoreSelector(getComments, shallowEqual);

  const renderComments = useCallback(({ item }: ListRenderItemInfo<string>) => {
    return <CommentListItem commentId={item} postId={id} />;
  }, []);

  return (
    <FlatList
      data={comments}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="always"
      keyExtractor={(item) => item}
      renderItem={renderComments}
      overScrollMode="never"
      ItemSeparatorComponent={() => (
        <View style={globalStyles.marginBottomSize2} />
      )}
      contentContainerStyle={[globalStyles.paddingVerticalSize7]}
    />
  );
}
