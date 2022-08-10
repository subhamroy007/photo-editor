import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AccountResponse,
  CommentResponse,
  PostResponse,
  StoryResponse,
} from "../constants/types";
import { COMMENT_RESPONSE, ACCOUNT_DATA, POST_DATA } from "../constants/data";
import { delay } from "../constants/utility";

export type CommentScreenApiResponse = {
  data: {
    post: CommentResponse | null;
    comments: CommentResponse[];
  };
};

export type StoryApiResponse = {
  data: {
    account: AccountResponse;
    stories: StoryResponse[];
  };
};

export type HomeFeedApiResponse = {
  data: {
    posts: PostResponse[];
  };
};

export type PostLikesApiResponse = {
  data: {
    noOfLikes: number;
    likes: AccountResponse[];
  };
};

export const storeApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/api/" }),
  reducerPath: "store-api",
  keepUnusedDataFor: 0,

  endpoints: (build) => ({
    getComments: build.query<CommentScreenApiResponse, string>({
      queryFn: async (postId) => {
        await delay(3000);

        return {
          data: {
            data: {
              post: {
                author: ACCOUNT_DATA[0],
                content: "this is a great post",
                id: postId,
                isLiked: false,
                noOfLikes: 0,
                noOfReplies: 0,
                timestamp: Date.now(),
                replies: [],
              },
              comments: COMMENT_RESPONSE,
            },
          },
        };
      },
    }),
    getStories: build.query<StoryApiResponse, string>({
      queryFn: async (userid) => {
        console.log("fetching");
        await delay(3000);
        const targetAccount = ACCOUNT_DATA.find(
          (item) => item.userid === userid
        )!;
        const stories: StoryResponse[] = [];

        return {
          data: {
            data: {
              account: targetAccount,
              stories,
            },
          },
        };
      },
    }),
    getHomeFeed: build.query<
      HomeFeedApiResponse,
      { offset: number; timestamp: number }
    >({
      queryFn: async ({ offset, timestamp }) => {
        return {
          data: {
            data: {
              posts: POST_DATA,
            },
          },
        };
      },
    }),
    getPostLikes: build.query<
      PostLikesApiResponse,
      { id: string; query: string; type: string }
    >({
      queryFn: async ({ id, query, type }) => {
        await delay(4000);
        return {
          data: {
            data: {
              likes: ACCOUNT_DATA,
              noOfLikes: 678475,
            },
          },
        };
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetStoriesQuery,
  useGetHomeFeedQuery,
  useGetPostLikesQuery,
} = storeApi;
