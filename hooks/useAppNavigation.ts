import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { LikeParams, RootStackScreenProps } from "../constants/types";

export function useAppNavigation() {
  const navigation = useNavigation<RootStackScreenProps["navigation"]>();

  const gotoHashtag = useCallback(
    (name: string) => {
      navigation.push("Hashtag", { name });
    },
    [navigation]
  );

  const gotoLocation = useCallback(
    (name: string) => {
      navigation.push("Location", { name });
    },
    [navigation]
  );

  const gotoAudio = useCallback(
    (id: string) => {
      navigation.push("Audio", { id });
    },
    [navigation]
  );

  const gotoEffect = useCallback(
    (id: string) => {
      navigation.push("Effect", { id });
    },
    [navigation]
  );

  const gotoAccount = useCallback(
    (userid: string) => {
      navigation.push("Account", { userid });
    },
    [navigation]
  );

  const gotoPost = useCallback(
    (id: string) => {
      navigation.push("Post", { id });
    },
    [navigation]
  );

  const gotoStory = useCallback(
    (userid: string) => {
      navigation.push("Story", { userid });
    },
    [navigation]
  );

  const gotoLikes = useCallback(
    (params: LikeParams) => {
      navigation.push("Likes", { ...params });
    },
    [navigation]
  );

  return {
    gotoAccount,
    gotoAudio,
    gotoEffect,
    gotoHashtag,
    gotoLikes,
    gotoLocation,
    gotoPost,
    gotoStory,
  };
}
