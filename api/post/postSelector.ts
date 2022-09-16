import { createDraftSafeSelector } from "@reduxjs/toolkit";
import {
  CommonPostItemParams,
  PostGlobalParams,
  PostItemParams,
} from "../../constants/types";
import { getTimeElapsedString } from "../../constants/utility";
import { StoreRootState } from "../store";
import { selectPostById } from "./postSlice";

export const selectPostItem = createDraftSafeSelector<
  [(state: StoreRootState, id: string) => PostItemParams],
  PostItemParams
>(
  (state, id) => {
    const post = selectPostById(state.post, id)! as PostGlobalParams;

    const commonPostParams: CommonPostItemParams = {
      id: post.id,
      author: post.author,
      caption: post.caption,
      isLiked: post.isLiked,
      isSaved: post.isSaved,
      noOfLikes: post.noOfLikes,
      timestamp: getTimeElapsedString(post.timestamp),
      location: post.location,
      noOfOpinions: post.noOfOpinions,
      account:
        post.accounts.length !== 1 ? post.accounts.length : post.accounts[0],
      thumbnail: post.thumbnail.thumbnailEncoded,
    };

    if (post.type === "photo") {
      return {
        ...commonPostParams,
        type: "photo",
        photos: post.photos!.media,
      };
    } else if (post.type === "video") {
      return {
        ...commonPostParams,
        type: "video",
        noOfAudience: post.video!.noOfAudience,
        title: post.video!.title,
        video: post.video!.media,
      };
    } else {
      return {
        ...commonPostParams,
        type: "moment",
        audio: post.moment!.audio,
        filter: post.moment!.filter,
        noOfAudience: post.moment!.noOfAudience,
        video: post.moment!.media,
      };
    }
  },
  (arg0) => {
    return arg0;
  }
);
