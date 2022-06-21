import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { SIZE_1 } from "../../constants/constants";
import { LocalMediaParams } from "../../constants/types";
import { AppContainer } from "./AppContainer";
import { LocalMediaListItem } from "./LocalMediaListItem";

export type RenderLocalMediaProps = {
  data: LocalMediaParams[];
  onItemTap: (index: number) => {};
  onItemLongPress: (index: number) => {};
  selectedMedia: number[];
  disableItemLongPress: boolean;
  multiselectable: boolean;
};

export function RenderLocalMedia(props: RenderLocalMediaProps) {
  const {
    data,
    disableItemLongPress,
    multiselectable,
    onItemLongPress,
    onItemTap,
    selectedMedia,
  } = props;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<LocalMediaParams>) => {
      //find the current item in the selected item list and get the index;
      const selectionIndex = selectedMedia.findIndex(
        (mediaItem) => mediaItem === index
      );

      return (
        <LocalMediaListItem
          disableLongPress={disableItemLongPress}
          index={index}
          media={item}
          multiselectable={multiselectable}
          onTap={onItemTap}
          selectionIndex={selectionIndex}
          onLongPress={onItemLongPress}
        />
      );
    },
    [
      disableItemLongPress,
      multiselectable,
      onItemLongPress,
      onItemTap,
      selectedMedia,
    ]
  );

  const getItemLayout = useCallback((_, index: number) => {
    return { length: SIZE_1, offset: index * SIZE_1, index };
  }, []);

  return (
    <AppContainer stretchToFill={true} selfAlignment="stretch">
      <FlatList
        data={data}
        renderItem={renderItem}
        extraData={props}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        style={styles.list}
        getItemLayout={getItemLayout}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignSelf: "stretch",
  },
});
