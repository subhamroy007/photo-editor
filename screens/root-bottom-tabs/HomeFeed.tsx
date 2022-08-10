import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { storeAccounts } from "../../api/accounts/accountSlice";
import { storeAudios } from "../../api/audio/audioSlice";
import { storeFilters } from "../../api/filter/filterSlice";
import {
  activateFullScreen,
  deActivateFullScreen,
} from "../../api/global/appSlice";
import { storePosts } from "../../api/post/postSlice";
import { useGetHomeFeedQuery } from "../../api/storeApi";
import { FullScreenPostItem } from "../../components/post/FullScreenPostItem";
import { AppHeader } from "../../components/utility/AppHeader";
import { AppShutter } from "../../components/utility/AppShutter";
import { SCREEN_HEIGHT } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import {
  AccountResponse,
  AudioResponse,
  FilterResponse,
} from "../../constants/types";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";

export function HomeFeed() {
  const { hideStatusBar } = useStatusBar(false);

  const [selectedPostId, setSelectedPostId] = useState("");

  const [homeFeedState, setHomeFeedState] = useState<{
    posts: { id: string }[];
    offset: number;
    timestamp: number;
    hasMorePages: boolean;
    skipRequest: boolean;
  }>({
    posts: [],
    offset: 0,
    timestamp: Date.now(),
    hasMorePages: true,
    skipRequest: false,
  });

  const { currentData, isSuccess } = useGetHomeFeedQuery(
    {
      offset: homeFeedState.offset,
      timestamp: homeFeedState.timestamp,
    },
    { skip: homeFeedState.skipRequest }
  );

  const dispatch = useStoreDispatch();

  useFocusEffect(() => {
    dispatch(activateFullScreen());
    hideStatusBar();

    return () => {
      // dispatch(deActivateFullScreen());
    };
  });

  useEffect(() => {
    if (isSuccess && currentData) {
      const accounts: AccountResponse[] = [];
      const audios: AudioResponse[] = [];
      const filters: FilterResponse[] = [];
      const posts: { id: string }[] = [];
      currentData.data.posts.forEach((post) => {
        accounts.push(post.author);
        accounts.push(...post.likes);
        accounts.push(...post.accounts);
        accounts.push(...post.comments.map((comment) => comment.author));
        if (post.moment) {
          if (post.moment.audio) {
            audios.push(post.moment.audio);
          }
          if (post.moment.filter) {
            filters.push(post.moment.filter);
          }
        }
        post.comments.forEach((comment) => {
          accounts.push(...comment.replies.map((reply) => reply.author));
        });
        posts.push({ id: post.id });
      });
      dispatch(storeAccounts(accounts));
      dispatch(storePosts(currentData.data.posts));
      dispatch(storeAudios(audios));
      dispatch(storeFilters(filters));

      setHomeFeedState((prevState) => {
        return {
          ...prevState,
          posts: [...prevState.posts, ...posts],
          offset: prevState.offset + posts.length,
          hasMorePages: posts.length > 0,
          skipRequest: true,
        };
      });
    }
  }, [isSuccess, currentData]);

  const isStatusBarConsidered = SCREEN_HEIGHT > 960;

  return (
    <SafeAreaView
      edges={[
        "bottom",
        "left",
        isStatusBarConsidered ? "top" : "left",
        "right",
      ]}
      style={[globalStyles.flex1, globalStyles.primaryDarkBackgroundColor]}
    >
      <ScrollView
        nestedScrollEnabled
        overScrollMode="never"
        pagingEnabled
        showsVerticalScrollIndicator={false}
      >
        {homeFeedState.posts.length > 0 && (
          <FullScreenPostItem
            isItemFocused
            openShareShutter={(postId) => {
              console.log("opening share shutter for post ", postId);
            }}
            openCommentsShutter={(postId) => {
              console.log("opening comment shutter for post ", postId);
            }}
            openLikesShutter={(postId) => {}}
            openMoreOptionModal={(postId) => {
              console.log("opening more modal for post ", postId);
            }}
            openTagsShuttrer={(postId) => {
              console.log("opening tag shutter for post ", postId);
            }}
            postId={homeFeedState.posts[2].id}
          />
        )}
      </ScrollView>
      <AppHeader title="Photos" transparent leftIcon="arrow-left" />
    </SafeAreaView>
  );
}
