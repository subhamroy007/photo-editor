import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { storeAccounts } from "../../api/accounts/accountSlice";
import {
  selectAppTheme,
  selectFullScreenActiveState,
} from "../../api/global/appSelector";
import { useGetPostLikesQuery } from "../../api/storeApi";
import { AccountListItem } from "../../components/post/account/AccountListItem";
import { AppIcon } from "../../components/utility/AppIcon";
import { AppLabel } from "../../components/utility/AppLabel";
import { AppLoadingIndicator } from "../../components/utility/AppLoadingIndicator";
import { SearchBox } from "../../components/utility/SearchBox";
import { COLOR_19, COLOR_5, COLOR_8 } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { RootStackNavigatorParams } from "../../constants/types";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useStoreDispatch } from "../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export type LikesScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "LikesScreen"
>;

export function LikesScreen({
  route: {
    params: { id, type },
  },
}: LikesScreenProps) {
  const isFullScreen = useStoreSelector(selectFullScreenActiveState);

  const theme = useStoreSelector(selectAppTheme);

  const [searchPhase, setSearchPhase] = useState("");

  const { showStatusBar, setToDarkContent, setToLightContent } = useStatusBar(
    undefined,
    isFullScreen ? "dark" : "light"
  );

  useFocusEffect(() => {
    showStatusBar();
    if (theme === "dark" || isFullScreen) {
      setToLightContent();
    }
  });

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

  const renderLikes = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      return <AccountListItem userid={item} transparent={isFullScreen} />;
    },
    [isFullScreen]
  );

  return (
    <SafeAreaView
      style={[
        globalStyles.flex1,
        isFullScreen
          ? globalStyles.semiTransparentBackgroundColor3
          : theme === "dark"
          ? globalStyles.primaryDarkBackgroundColor
          : globalStyles.primaryLightBackgroundColor,
      ]}
      edges={["bottom", "left", "right", "top"]}
    >
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
                <AppIcon
                  name="undo"
                  borderVisible
                  gap="medium"
                  type="info"
                  transparent={isFullScreen}
                />
              </Pressable>
            ) : (
              <>
                <AppIcon
                  name="heart-outline"
                  borderVisible
                  gap="medium"
                  size="large"
                  transparent={isFullScreen}
                />
                <AppLabel
                  text="No Likes In The Post Yet"
                  size="large"
                  style="bold"
                  transparent={isFullScreen}
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
                theme === "dark" || isFullScreen
                  ? globalStyles.primaryLightBorderColor
                  : globalStyles.primaryDarkBorderColor,
                globalStyles.paddingHorizontalSize7,
                globalStyles.paddingVerticalSize7,
                globalStyles.marginBottomSize2,
              ]}
            >
              <AppLabel
                text={postLikesState.noOfLikes + " Likes"}
                size="large"
                type="info"
                transparent={isFullScreen}
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
                transparent={isFullScreen}
              />
            </View>
          ) : null
        }
        ListFooterComponent={
          isLikesSuccess && currentData ? (
            <View style={globalStyles.marginTopSize2} />
          ) : null
        }
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
}
