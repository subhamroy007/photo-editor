import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from "@reduxjs/toolkit";
import { PostGlobalParams, PostResponse } from "../../constants/types";
import { convertPosts } from "../../constants/utility";
import { fetchFollowingFeed } from "./postThunk";

const postAdapter = createEntityAdapter<PostGlobalParams>({
  selectId: (entity) => entity.id,
});

const postSlice = createSlice({
  name: "post-slice",
  initialState: postAdapter.getInitialState(),
  reducers: {
    togglePostLike: {
      prepare(postId: string, setToLike: boolean = false) {
        return {
          payload: {
            postId,
            setToLike,
          },
        };
      },
      reducer(
        state,
        {
          payload: { postId, setToLike },
        }: PayloadAction<{ postId: string; setToLike: boolean }>
      ) {
        const post = state.entities[postId];
        if (post) {
          if (!setToLike) {
            post.noOfLikes = post.isLiked
              ? post.noOfLikes - 1
              : post.noOfLikes + 1;
            post.isLiked = !post.isLiked;
          } else if (!post.isLiked) {
            post.noOfLikes = post.noOfLikes + 1;
            post.isLiked = true;
          }
        }
      },
    },
    togglePostSaved: {
      prepare(postId: string) {
        return {
          payload: postId,
        };
      },
      reducer(state, { payload: postId }: PayloadAction<string>) {
        const targetPost = state.entities[postId];
        if (targetPost) {
          targetPost.isSaved = !targetPost.isSaved;
        }
      },
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchFollowingFeed.fulfilled,
      (
        state,
        {
          payload: {
            data: { posts },
          },
        }
      ) => {
        postAdapter.upsertMany(
          state,
          convertPosts(posts.map((item) => item.data))
        );
      }
    );
  },
});

export const {
  actions: { togglePostLike, togglePostSaved },
  reducer: postReducer,
} = postSlice;

export const { selectById: selectPostById } = postAdapter.getSelectors();
