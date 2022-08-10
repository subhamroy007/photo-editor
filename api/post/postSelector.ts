import { createDraftSafeSelector } from "@reduxjs/toolkit";
import {
  AccountResponse,
  MediaParams,
  PostGlobalParams,
  PostItemParams,
} from "../../constants/types";
import { selectAccountById } from "../accounts/accountSlice";
import { selectAudioById } from "../audio/audioSlice";
import { selectFilterById } from "../filter/filterSlice";
import { selectDefaultProfilePicuture } from "../global/appSelector";
import { StoreRootState } from "../store";
import { selectPostById } from "./postSlice";

export const selectPostItem = createDraftSafeSelector<
  [(state: StoreRootState, id: string) => PostItemParams],
  PostItemParams
>(
  (state, id) => {
    const post = selectPostById(state.post, id)! as PostGlobalParams;
    const author = selectAccountById(
      state.account,
      post.author
    )! as AccountResponse;

    const audio =
      post.moment && post.moment.audio !== ""
        ? selectAudioById(state.audio, post.moment.audio)!
        : null;

    const filter =
      post.moment && post.moment.filter !== ""
        ? selectFilterById(state.filter, post.moment.filter)!
        : null;

    const defaultProfilePicture = selectDefaultProfilePicuture(
      state
    ) as MediaParams;
    return {
      id: post.id,
      type: post.type,
      category: post.category,
      caption: post.caption,
      isLiked: post.isLiked,
      isSaved: post.isSaved,
      noOfComments: post.noOfComments,
      noOfLikes: post.noOfLikes,
      noOfViews: post.noOfViews,
      timestamp: post.timestamp,
      previewEncoded: post.previewEncoded,
      location: post.location ? post.location.name : "",
      author: {
        isFavourite: author.isFavourite,
        isFollowing: author.isFollowing,
        userid: author.userid,
        profilePicture: author.profilePicture
          ? author.profilePicture.preview
          : defaultProfilePicture,
        showStoryIndicator:
          author.hasNewStory ||
          author.stories.find((item) => !item.hasSeen) !== undefined,
        id: author.id,
      },
      accounts:
        post.accounts.length !== 1
          ? post.accounts.length
          : selectAccountById(state.account, post.accounts[0])!.userid,
      likes: post.likes.map((item) => {
        const account = selectAccountById(
          state.account,
          item
        )! as AccountResponse;
        return {
          profilePicture: account.profilePicture
            ? account.profilePicture.preview
            : defaultProfilePicture,
          userid: account.userid,
        };
      }),
      comments: post.comments.slice(0, 2).map((item) => {
        const account = selectAccountById(
          state.account,
          item.author
        )! as AccountResponse;
        return {
          content: item.content,
          author: account.userid,
          id: item.id,
        };
      }),
      photo: post.photo,
      video: post.video,
      moment: post.moment
        ? {
            video: post.moment.video,
            audio,
            filter,
          }
        : null,
    };
  },
  (arg0) => {
    return arg0;
  }
);
