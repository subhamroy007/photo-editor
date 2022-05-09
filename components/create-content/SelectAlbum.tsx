import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../../constants/constants";
import { AppContainer } from "../utility/AppContainer";
import { AppLabel } from "../utility/AppLabel";

export type SelectAlbumProps = {
  albums: string[];
  onAlbumSelect: (album: string) => void;
  selectedAlbum: string;
};

export function SelectAlbum({
  albums,
  onAlbumSelect,
  selectedAlbum,
}: SelectAlbumProps) {
  const renderAlbum = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      return (
        <AppLabel
          text={item}
          gap="large"
          foreground={selectedAlbum === item ? "grey" : "black"}
          selfAlignment="stretch"
          background="transparent"
          style="regular"
          onPress={() => {
            onAlbumSelect(item);
          }}
        />
      );
    },
    [onAlbumSelect, selectedAlbum]
  );

  return (
    <AppContainer
      selfAlignment="stretch"
      height={SCREEN_HEIGHT - 100}
      backgroundColor="white"
    >
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
});
