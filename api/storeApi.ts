import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IMAGE_POSTS, MOMENTS_POSTS, VIDEO_POSTS } from "../constants/data";
import {
  AccountResponse,
  CommentResponse,
  PostResponse,
  StoryResponse,
} from "../constants/types";
import { delay } from "../constants/utility";

export type CommentScreenApiResponse = {
  data: {
    noOfComments: number;
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
    getComments: build.query<
      CommentScreenApiResponse,
      { postId: string; offset: number; timestamp: number }
    >({
      queryFn: async ({ offset, postId, timestamp }) => {
        await delay(3000);

        return {
          data: {
            data: {
              noOfComments: 67,
              comments: [],
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
              posts: [
                IMAGE_POSTS[0],
                IMAGE_POSTS[1],
                MOMENTS_POSTS[0],
                IMAGE_POSTS[2],
                MOMENTS_POSTS[1],
                VIDEO_POSTS[0],
                MOMENTS_POSTS[2],
                IMAGE_POSTS[3],
                MOMENTS_POSTS[3],
              ],
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
              likes: [],
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
  useGetHomeFeedQuery,
  useGetPostLikesQuery,
} = storeApi;
