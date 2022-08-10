import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { AccountResponse, MediaParams } from "../../constants/types";
import { selectDefaultProfilePicuture } from "../global/appSelector";
import { StoreRootState } from "../store";
import { selectAccountById } from "./accountSlice";

export type AccountItemParams = {
  id: string;
  userid: string;
  username: string;
  profilePicture: MediaParams;
  isFollowing: boolean;
  hasUnSeenStory: boolean;
  hasNewStory: boolean;
};

export const selectAccountItem = createDraftSafeSelector<
  [(state: StoreRootState, id: string) => AccountItemParams],
  AccountItemParams
>(
  (state, id) => {
    const account = selectAccountById(state.account, id)! as AccountResponse;

    const defaultProfilePicture = selectDefaultProfilePicuture(state);

    return {
      hasNewStory: account.hasNewStory,
      hasUnSeenStory:
        account.hasNewStory ||
        account.stories.findIndex((item) => !item.hasSeen) === -1,
      id: account.id,
      isFollowing: account.isFollowing,
      profilePicture: account.profilePicture
        ? account.profilePicture.preview
        : defaultProfilePicture,
      userid: account.userid,
      username: account.username,
    };
  },
  (arg0) => {
    return arg0;
  }
);
