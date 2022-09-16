import { createAsyncThunk } from "@reduxjs/toolkit";
import { AccountResponse, AsyncThunkConfig } from "../../constants/types";
import { StoreDispatch, StoreRootState } from "../store";

type LikesResponse = {
  data: {
    likes: AccountResponse[];
  };
  meta: {
    postId: string;
  };
};

export const fetchPostLikes = createAsyncThunk<
  LikesResponse,
  string,
  AsyncThunkConfig
>("account/fetchPostLikes", async (postId, thunkApi) => {
  return thunkApi.fulfillWithValue<LikesResponse>(
    {
      data: { likes: [] },
      meta: { postId },
    },
    undefined
  );
});
