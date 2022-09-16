import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AccountGlobalParams } from "../../constants/types";
import {
  convertAccounts,
  extractAccountsFromPosts,
} from "../../constants/utility";
import { fetchFollowingFeed } from "../post/postThunk";

const accountAdapter = createEntityAdapter<AccountGlobalParams>({
  selectId: (entity) => entity.userid,
});

const accountSlice = createSlice({
  name: "account-slice",
  initialState: accountAdapter.getInitialState(),
  reducers: {
    toggleAccountFollowing: {
      prepare(id: string, setToFollow: boolean = false) {
        return {
          payload: {
            id,
            setToFollow,
          },
        };
      },
      reducer(
        state,
        {
          payload: { id, setToFollow },
        }: PayloadAction<{ id: string; setToFollow: boolean }>
      ) {
        const account = state.entities[id];
        if (account) {
          if (!setToFollow) {
            account.isFollowing = !account.isFollowing;
          } else if (!account.isFollowing) {
            account.isFollowing = true;
          }
        }
      },
    },
    toggleAccountFavourite: {
      prepare(id: string) {
        return {
          payload: id,
        };
      },
      reducer(state, { payload: userid }: PayloadAction<string>) {
        const account = state.entities[userid];
        if (account) {
          account.isFavourite = !account.isFavourite;
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
            data: { posts, stories, suggestedAccounts },
          },
        }
      ) => {
        const accounts: AccountGlobalParams[] = [
          ...convertAccounts(stories),
          ...convertAccounts(suggestedAccounts),
          ...extractAccountsFromPosts(posts.map((item) => item.data)),
        ];

        accountAdapter.upsertMany(state, accounts);
      }
    );
  },
});

export const {
  actions: { toggleAccountFollowing, toggleAccountFavourite },
  reducer: accountReducer,
} = accountSlice;

export const { selectById: selectAccountById } = accountAdapter.getSelectors();
