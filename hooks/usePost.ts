import { useCallback, useRef } from "react";
import { Share } from "react-native";
import { shallowEqual } from "react-redux";
import { selectPostItem } from "../api/post/postSelector";
import { togglePostLike, togglePostSaved } from "../api/post/postSlice";
import { useStoreDispatch } from "./useStoreDispatch";
import { useStoreSelector } from "./useStoreSelector";
import { setString } from "expo-clipboard";
import { useAccount } from "./useAccount";
import { useAppNavigation } from "./useAppNavigation";

export function usePost(postId: string) {
  const dispatch = useStoreDispatch();

  const getPost = useCallback(
    (state) => selectPostItem(state, postId),
    [postId]
  );

  const post = useStoreSelector(getPost, shallowEqual);

  const { gotoAudio, gotoEffect, gotoLocation, gotoLikes, gotoPost } =
    useAppNavigation();

  const {
    account: author,
    handleStory,
    toggleFavouriteState,
    toggleFollowState,
    isAccountFollowing,
    muteAccount,
    navigateToAccount,
  } = useAccount(post.author);

  const shareLink = useCallback(async (toExternal?: boolean) => {
    if (toExternal) {
      await Share.share({
        message: "link",
        url: "link",
        title: "Share Link",
      });
    } else {
      setString("link");
    }
  }, []);

  const toggleLikeState = useCallback((value?: boolean) => {
    //disptach thunk to like the post
    dispatch(togglePostLike(post.id, value));
  }, []);

  const toggleBookmarkState = useCallback(() => {
    //dispath thunk to save the post
    dispatch(togglePostSaved(post.id));
  }, []);

  const navigateToAudio = useCallback(() => {
    if (post.type === "moment" && post.audio) {
      gotoAudio(post.audio.id);
    }
  }, [gotoAudio]);

  const navigateToEffect = useCallback(() => {
    if (post.type === "moment" && post.filter) {
      gotoEffect(post.filter.id);
    }
  }, [gotoEffect]);

  const navigateToLocation = useCallback(() => {
    gotoLocation(post.location);
  }, [gotoLocation]);

  const navigateToLikes = useCallback(() => {
    gotoLikes({ type: "post", postId: post.id });
  }, [gotoLikes]);

  const navigateToPost = useCallback(() => {
    gotoPost(post.id);
  }, [gotoPost]);

  return {
    post,
    author,
    navigateToAccount,
    navigateToAudio,
    navigateToEffect,
    navigateToLikes,
    navigateToLocation,
    navigateToPost,
    toggleFavouriteState,
    toggleFollowState,
    toggleBookmarkState,
    toggleLikeState,
    shareLink,
    handleStory,
    muteAccount,
    isAccountFollowing,
  };
}
