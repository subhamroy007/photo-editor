import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { storeAccounts } from "../../../api/accounts/accountSlice";
import { selectAppTheme } from "../../../api/global/appSelector";
import { useGetPostLikesQuery } from "../../../api/storeApi";
import { globalStyles } from "../../../constants/style";
import { useStoreDispatch } from "../../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Icon } from "../../utility/Icon";
import { Label } from "../../utility/Label";
import { AppLoadingIndicator } from "../../utility/AppLoadingIndicator";
import { SearchBox } from "../../utility/SearchBox";
import { AccountListItem } from "./AccountListItem";

export type LikesListProps = {
  id: string;
  type: "post" | "comment" | "reply";
  gotoAccount: (userid: string) => void;
  transparent?: boolean;
};

export function LikesList({
  gotoAccount,
  id,
  type,
  transparent,
}: LikesListProps) {
  const theme = useStoreSelector(selectAppTheme);

  const [searchPhase, setSearchPhase] = useState("");
  const {
    isError: isLikesError,
    isLoading: isLikesLoading,
    isSuccess: isLikesSuccess,
    currentData,
    refetch: reloadLikes,
    isFetching: isLikesFetching,
  } = useGetPostLikesQuery(
    { id, type, query: searchPhase },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const dispatch = useStoreDispatch();

  const [postLikesState, setPostLikesState] = useState<{
    likes: string[];
    noOfLikes: number;
  }>({
    likes: [],
    noOfLikes: 0,
  });

  useEffect(() => {
    if (isLikesSuccess && currentData) {
      dispatch(storeAccounts(currentData.data.likes));
      setPostLikesState({
        likes: currentData.data.likes.map((like) => like.id),
        noOfLikes: currentData.data.noOfLikes,
      });
    }
  }, [isLikesSuccess, currentData]);

  const renderLikes = useCallback(({ item }: ListRenderItemInfo<string>) => {
    return (
      <AccountListItem
        id={item}
        transparent={transparent}
        gotoAccount={gotoAccount}
      />
    );
  }, []);

  return (
    <FlatList
      data={postLikesState.likes}
      showsVerticalScrollIndicator={false}
      renderItem={renderLikes}
      keyExtractor={(item) => item}
      ListEmptyComponent={
        <View
          style={[
            globalStyles.alignCenter,
            globalStyles.justifyCenter,
            globalStyles.marginTopSize9,
          ]}
        >
          {isLikesFetching ? (
            <AppLoadingIndicator />
          ) : isLikesError ? (
            <Pressable android_disableSound onPress={reloadLikes}>
              <Icon
                name="retry"
                borderVisible
                gap="medium"
                type="info"
                transparent={transparent}
              />
            </Pressable>
          ) : (
            <>
              <Icon
                name="heart-outline"
                borderVisible
                gap="medium"
                size="large"
                transparent={transparent}
              />
              <Label
                text="No Likes In The Post Yet"
                size="large"
                style="bold"
                transparent={transparent}
                styleProp={globalStyles.marginTopSize4}
              />
            </>
          )}
        </View>
      }
      overScrollMode="never"
      ListHeaderComponent={
        !isLikesLoading && postLikesState.noOfLikes > 0 ? (
          <View
            style={[
              globalStyles.primaryBottomBorderWidth,
              theme === "dark" || transparent
                ? globalStyles.primaryLightBorderColor
                : globalStyles.primaryDarkBorderColor,
              globalStyles.paddingHorizontalSize7,
              globalStyles.paddingVerticalSize7,
              globalStyles.marginBottomSize2,
            ]}
          >
            <Label
              text={postLikesState.noOfLikes + " Likes"}
              size="large"
              type="info"
              transparent={transparent}
            />
            <SearchBox
              textContent={searchPhase}
              style={globalStyles.marginTopSize7}
              onTextContentChange={(value) => {
                setPostLikesState((prevState) => ({
                  ...prevState,
                  likes: [],
                }));
                setSearchPhase(value);
              }}
              transparent={transparent}
            />
          </View>
        ) : null
      }
      keyboardShouldPersistTaps="always"
      keyboardDismissMode="on-drag"
    />
  );
}
