import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ACCOUNTS,
  IMAGE_POSTS,
  MOMENTS_POSTS,
  VIDEO_POSTS,
} from "../../constants/data";
import {
  AccountResponse,
  AsyncThunkConfig,
  PostResponse,
} from "../../constants/types";

export type FollowingFeedResponseParams = {
  data: {
    posts: { meta: { [key: string]: string }; data: PostResponse }[];
    stories: AccountResponse[];
    suggestedAccounts: AccountResponse[];
  };
  meta: {
    timestamp: number;
    fetchAccountSuggestions: boolean;
    fetchStories: boolean;
    fetchSuggestions: boolean;
  };
};

export type FollowingFeedRequestParams = {
  timestamp: number;
  fetchAccountSuggestions: boolean;
  fetchStories: boolean;
  fetchSuggestions: boolean;
};

export const fetchFollowingFeed = createAsyncThunk<
  FollowingFeedResponseParams,
  FollowingFeedRequestParams,
  AsyncThunkConfig
>(
  "account/fetchFollowingFeed",
  async (
    { timestamp, fetchSuggestions, fetchAccountSuggestions, fetchStories },
    thunkApi
  ) => {
    const posts: PostResponse[] = [
      IMAGE_POSTS[0],
      IMAGE_POSTS[1],
      MOMENTS_POSTS[0],
      IMAGE_POSTS[2],
      MOMENTS_POSTS[1],
      VIDEO_POSTS[0],
      MOMENTS_POSTS[2],
      IMAGE_POSTS[3],
      MOMENTS_POSTS[3],
    ];

    return thunkApi.fulfillWithValue<FollowingFeedResponseParams>(
      {
        data: {
          posts: posts.map((item) => ({ data: item, meta: {} })),
          stories: [...ACCOUNTS],
          suggestedAccounts: [],
        },
        meta: {
          timestamp,
          fetchSuggestions,
          fetchAccountSuggestions,
          fetchStories,
        },
      },
      undefined
    );
  }
);
