import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AccountResponse } from "../../constants/types";

const accountAdapter = createEntityAdapter<AccountResponse>({
  selectId: (entity) => entity.id,
});

const accountSlice = createSlice({
  name: "account-slice",
  initialState: accountAdapter.getInitialState(),
  reducers: {
    storeAccounts: {
      prepare(accounts: AccountResponse[]) {
        return { payload: accounts };
      },
      reducer(state, { payload }: PayloadAction<AccountResponse[]>) {
        const result = payload.map<AccountResponse>((item) => {
          const targetAccount = state.entities[item.id];

          return {
            ...item,
            stories: [
              ...item.stories,
              ...(targetAccount ? targetAccount.stories : []),
            ],
          };
        });

        accountAdapter.upsertMany(state, result);
      },
    },
    toggleAccountFollowing: {
      prepare(userid: string, setToFollow: boolean = false) {
        return {
          payload: {
            userid,
            setToFollow,
          },
        };
      },
      reducer(
        state,
        {
          payload: { userid, setToFollow },
        }: PayloadAction<{ userid: string; setToFollow: boolean }>
      ) {
        const account = state.entities[userid];
        if (account) {
          if (!setToFollow) {
            account.noOfFollowers = account.isFollowing
              ? account.noOfFollowers - 1
              : account.noOfFollowers + 1;
            account.isFollowing = !account.isFollowing;
          } else if (!account.isFollowing) {
            account.noOfFollowers = account.noOfFollowers + 1;
            account.isFollowing = true;
          }
        }
      },
    },
  },
});

export const {
  actions: { storeAccounts, toggleAccountFollowing },
  reducer: accountReducer,
} = accountSlice;

export const { selectById: selectAccountById } = accountAdapter.getSelectors();
