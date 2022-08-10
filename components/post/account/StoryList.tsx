import React, { useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { STORY_LIST_ITEM_SIZE } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountShortResponse } from "../../../constants/types";
import { StoryListItem } from "./StoryListItem";

export type StoryListProps = {
  accounts: AccountShortResponse[];
  storyLoadingAccountId: string;
  onTap: (index: number) => void;
  onDoubleTap: (index: number) => void;
  onLongPress: (index: number) => void;
};

export function StoryList(props: StoryListProps) {
  const { accounts, onDoubleTap, onLongPress, onTap, storyLoadingAccountId } =
    props;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<AccountShortResponse>) => {
      return (
        <StoryListItem
          account={item}
          isStoryLoading={item.userid === storyLoadingAccountId}
          onDoubleTap={() => {
            onDoubleTap(index);
          }}
          onLongPress={() => {
            onLongPress(index);
          }}
          onTap={() => {
            onTap(index);
          }}
        />
      );
    },
    [storyLoadingAccountId]
  );

  return (
    <FlatList
      data={accounts}
      renderItem={renderItem}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        globalStyles.paddingVerticalSize2,
        globalStyles.paddingHorizontalSize2,
      ]}
      style={[
        globalStyles.primaryBottomBorderWidth,
        globalStyles.primaryDarkBorderColor,
      ]}
      extraData={props}
      getItemLayout={(_, index) => {
        return {
          index,
          length: STORY_LIST_ITEM_SIZE,
          offset: index * STORY_LIST_ITEM_SIZE,
        };
      }}
    />
  );
}
