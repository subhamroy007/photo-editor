import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { AccountGlobalParams, AccountItemParams } from "../../constants/types";
import {
  selectAccountId,
  selectDefaultProfilePicuture,
} from "../global/appSelector";
import { StoreRootState } from "../store";
import { selectAccountById } from "./accountSlice";

export const selectAccountItem = createDraftSafeSelector<
  [(state: StoreRootState, id: string) => AccountItemParams],
  AccountItemParams
>(
  (state, id) => {
    const account = selectAccountById(state.account, id) as AccountGlobalParams;

    const defaultProfilePicture = selectDefaultProfilePicuture(state);

    const userid = selectAccountId(state);

    return {
      hasNewStory: account.hasNewStory,
      hasUnseenStory:
        account.hasNewStory ||
        account.stories.findIndex((item) => !item.hasSeen) === -1,
      isFollowing: account.isFollowing,
      profilePicture: account.profilePicture
        ? account.profilePicture.preview
        : defaultProfilePicture,
      userid: account.userid,
      username: account.username,
      isFavourite: account.isFavourite,
      isUser: account.userid === userid,
    };
  },
  (arg0) => {
    return arg0;
  }
);
