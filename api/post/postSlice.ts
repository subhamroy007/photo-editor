import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  CommentGlobalParams,
  PostGlobalParams,
  PostResponse,
} from "../../constants/types";

const postAdapter = createEntityAdapter<PostGlobalParams>({
  selectId: (entity) => entity.id,
});

const postSlice = createSlice({
  name: "post-slice",
  initialState: postAdapter.getInitialState(),
  reducers: {
    storePosts: {
      prepare(posts: PostResponse[]) {
        return { payload: posts };
      },
      reducer(state, { payload }: PayloadAction<PostResponse[]>) {
        const result = payload.map<PostGlobalParams>((item) => {
          const targetPost = state.entities[item.id];
          return {
            ...item,
            comments:
              targetPost && targetPost.comments.length > 0
                ? targetPost.comments
                : item.comments.map<CommentGlobalParams>((comment) => {
                    return {
                      ...comment,
                      author: comment.author.id,
                      replies: [],
                    };
                  }),
            likes: item.likes.map((account) => account.id),
            author: item.author.id,
            accounts: item.accounts.map((account) => account.id),
            moment: item.moment
              ? {
                  audio: item.moment.audio ? item.moment.audio.id : "",
                  video: item.moment.video,
                  filter: item.moment.filter ? item.moment.filter.id : "",
                }
              : null,
          };
        });

        postAdapter.upsertMany(state, result);
      },
    },
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
  },
});

export const {
  actions: { storePosts, togglePostLike },
  reducer: postReducer,
} = postSlice;

export const { selectById: selectPostById } = postAdapter.getSelectors();
