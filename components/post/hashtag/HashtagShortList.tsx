import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ListRenderItemInfo, Pressable, View } from "react-native";
import { COLOR_5, SIZE_15, SIZE_5 } from "../../../constants/constants";
import { [] } from "../../../constants/data";
import { globalStyles } from "../../../constants/style";
import { HashtagResponse } from "../../../constants/types";
import { Icon } from "../../utility/Icon";
import { Label } from "../../utility/Label";
import { AppLoadingIndicator } from "../../utility/AppLoadingIndicator";
import { HashtagShortListItem } from "./HashtagShortListItem";

export type HashtagShortListProps = {
  onSelect: (hashtag: string) => void;
  searchPhase: string;
};

export function HashtagShortList({
  onSelect,
  searchPhase,
}: HashtagShortListProps) {
  const [searchState, setSearchState] = useState<{
    hashtags: HashtagResponse[];
    isLoading: boolean;
    isError: boolean;
  }>({ hashtags: [], isError: false, isLoading: false });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSearchState({ hashtags: [], isLoading: true, isError: false });
  }, [searchPhase]);

  useEffect(() => {
    if (searchState.isLoading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setSearchState({
          hashtags: [],
          isError: false,
          isLoading: false,
        });
      }, 3000);
    }
  }, [searchState.isLoading]);

  const retryHandler = useCallback(() => {
    setSearchState((prevState) => ({
      ...prevState,
      isError: false,
      isLoading: true,
    }));
  }, []);

  const renderHashtag = useCallback(
    ({ item }: ListRenderItemInfo<HashtagResponse>) => {
      return (
        <HashtagShortListItem
          hashtag={item}
          onSelect={() => {
            onSelect(item.hashtag);
          }}
        />
      );
    },
    []
  );

  const fallback = useCallback(() => {
    return (
      <View style={[globalStyles.alignCenter, globalStyles.marginTopSize4]}>
        {searchState.isLoading ? (
          <AppLoadingIndicator color={COLOR_5} size="small" />
        ) : searchState.isError ? (
          <Pressable onPress={retryHandler}>
            <Icon
              name="undo"
              size="small"
              gap="medium"
              borderVisible
              foreground={COLOR_5}
            />
          </Pressable>
        ) : (
          <Label text="no hashtag found" foreground={COLOR_5} />
        )}
      </View>
    );
  }, [searchState.isLoading, searchState.isError]);

  const getItemLayout = useCallback(
    (data: HashtagResponse[] | null | undefined, index: number) => {
      const size = 2 * SIZE_5 + SIZE_15;
      return {
        index,
        length: size,
        offset: index * size,
      };
    },
    []
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
      data={searchState.hashtags}
      renderItem={renderHashtag}
      ListEmptyComponent={fallback}
      getItemLayout={getItemLayout}
      extraData={searchState}
    />
  );
}
