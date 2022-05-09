import { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SIZE_5 } from "../../constants/constants";
import { LocationShortResponse } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppTextInput } from "../utility/AppTextInput";
import { LocationListItem } from "./LocationListItem";

export type LocationSearchState = {
  searchResult: LocationShortResponse[];
  searchQuery: string;
  suggested: LocationShortResponse[];
};

export type LocationSearchProps = {
  onLocationSelect: (location: LocationShortResponse) => void;
};

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [state, setState] = useState<LocationSearchState>({
    searchQuery: "",
    searchResult: [],
    suggested: [
      { name: "pasedina", title: "california", id: "0" },
      { name: "kandi harisagarpar", title: "mushidabad", id: "1" },
      { name: "washington dc", title: "north dakota", id: "2" },
      { name: "pasedina", title: "california", id: "3" },
      { name: "kandi harisagarpar", title: "mushidabad", id: "4" },
      { name: "washington dc", title: "north dakota", id: "5" },
      { name: "pasedina", title: "california", id: "6" },
      { name: "kandi harisagarpar", title: "mushidabad", id: "7" },
      { name: "washington dc", title: "north dakota", id: "8" },
      { name: "pasedina", title: "california", id: "9" },
      { name: "kandi harisagarpar", title: "mushidabad", id: "10" },
      { name: "washington dc", title: "north dakota", id: "11" },
      { name: "pasedina", title: "california", id: "12" },
      { name: "kandi harisagarpar", title: "mushidabad", id: "13" },
      { name: "washington dc", title: "north dakota", id: "14" },
    ],
  });

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<LocationShortResponse>) => {
      const onPress = () => {
        onLocationSelect(item);
      };

      return <LocationListItem {...item} onPress={onPress} />;
    },
    [onLocationSelect]
  );

  const onSearchQueryChange = useCallback((text: string) => {
    setState((prevState) => ({ ...prevState, searchQuery: text }));
  }, []);

  return (
    <AppContainer
      selfAlignment="stretch"
      height={SCREEN_HEIGHT - 100}
      majorAxisAlignment="start"
    >
      <AppTextInput
        placeholder="Search Here"
        styleProp={{ margin: SIZE_5 }}
        style="solid"
        onTextChange={onSearchQueryChange}
        text={state.searchQuery}
      />
      <FlatList
        data={state.suggested}
        renderItem={renderItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        extraData={state}
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
