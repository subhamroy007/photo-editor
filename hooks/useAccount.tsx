import { useCallback, useRef } from "react";
import { shallowEqual } from "react-redux";
import { selectAccountItem } from "../api/accounts/accountSelector";
import {
  toggleAccountFavourite,
  toggleAccountFollowing,
} from "../api/accounts/accountSlice";
import {
  addToMutedAccounts,
  addToUnfollowedAccounts,
} from "../api/global/appSlice";
import { useAppNavigation } from "./useAppNavigation";
import { useStoreDispatch } from "./useStoreDispatch";
import { useStoreSelector } from "./useStoreSelector";

export function useAccount(userid: string) {
  const { gotoAccount, gotoStory } = useAppNavigation();

  const dispatch = useStoreDispatch();

  const getAccount = useCallback(
    (state) => selectAccountItem(state, userid),
    [userid]
  );

  const account = useStoreSelector(getAccount, shallowEqual);

  const isAccountFollowing = useRef(account.isFollowing).current;

  const handleStory = useCallback(() => {
    gotoStory(account.userid);
    // if (account.hasNewStory) {
    // } else if (account.hasUnseenStory) {
    // } else {
    //   gotoAccount(account.userid);
    // }
  }, [
    // account.hasNewStory,
    // account.hasUnseenStory,
    account.userid,
    gotoStory,
    // gotoAccount,
  ]);

  const navigateToAccount = useCallback(() => {
    gotoAccount(account.userid);
  }, [gotoAccount]);

  const toggleFollowState = useCallback(() => {
    if (isAccountFollowing) {
      dispatch(addToUnfollowedAccounts(account.userid));
    }
    //dispath thunk to follow
    dispatch(toggleAccountFollowing(account.userid));
  }, [account.userid, isAccountFollowing]);

  const toggleFavouriteState = useCallback(() => {
    //dispath thunk to favourite
    dispatch(toggleAccountFavourite(account.userid));
  }, [account.userid]);

  const muteAccount = useCallback(() => {
    dispatch(addToMutedAccounts(account.userid));
  }, [account.userid]);

  return {
    handleStory,
    toggleFollowState,
    toggleFavouriteState,
    muteAccount,
    account,
    isAccountFollowing,
    navigateToAccount,
  };
}
