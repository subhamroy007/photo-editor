import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SIZE_1, SIZE_14, SIZE_6 } from "../../constants/constants";
import { AppIcon } from "../utility/AppIcon";
import { AppContainer } from "../utility/AppContainer";
import { AppLabel } from "../utility/AppLabel";
import { AppHeader } from "../utility/AppHeader";
import { MediaParams } from "../../constants/types";
import { PhotoListItem } from "./PhotoListItem";
import { LocalMediaParams, useLocalMedia } from "../../hooks/useLocalMedia";
import { AppAvatar } from "../utility/AppAvatar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackNavigationParams } from "../../navigators/RootStackNavigator";
import { useNavigation } from "@react-navigation/native";

type ScreenProps = NativeStackScreenProps<
  RootStackNavigationParams,
  "CreateContent"
>;

export type PhotoListState = {
  selectedPhotoIndices: number[];
  selectedAlbumIndex: number;
  isMultiSelectable: boolean;
  isAlbumSwitchModalOpen: boolean;
};

export function PhotoList() {
  const navigation = useNavigation<ScreenProps["navigation"]>();

  const [state, setState] = useState<PhotoListState>({
    isMultiSelectable: false,
    isAlbumSwitchModalOpen: false,
    selectedAlbumIndex: -1,
    selectedPhotoIndices: [],
  });

  const { albums, fetchMedia, isError, isLoading, media } =
    useLocalMedia("Photos");

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const onMultiSelectToggle = useCallback(() => {
    setState((prevState) => {
      return {
        ...prevState,
        isMultiSelectable: !prevState.isMultiSelectable,
        selectedPhotoIndices:
          prevState.selectedPhotoIndices.length === 0
            ? []
            : [prevState.selectedPhotoIndices[0]],
      };
    });
  }, []);

  const toggleAlbumSwitchModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAlbumSwitchModalOpen: !prevState.isAlbumSwitchModalOpen,
    }));
  }, []);

  const onAlbumSelect = useCallback((index: number) => {
    setState((prevState) => ({
      ...prevState,
      selectedAlbumIndex: index,
      isAlbumSwitchModalOpen: false,
    }));
  }, []);

  const getItemLayout = useCallback(
    (data: MediaParams[] | null | undefined, index: number) => {
      return {
        index,
        length: SIZE_1,
        offset: index * SIZE_1,
      };
    },
    []
  );

  const onSelect = useCallback((index: number) => {
    setState((prevState) => {
      const selectionIndex = prevState.selectedPhotoIndices.findIndex(
        (item) => item === index
      );

      if (selectionIndex === -1) {
        if (!prevState.isMultiSelectable) {
          return {
            ...prevState,
            selectedPhotoIndices: [index],
          };
        } else if (prevState.selectedPhotoIndices.length < 10) {
          return {
            ...prevState,
            selectedPhotoIndices: [...prevState.selectedPhotoIndices, index],
          };
        } else {
          return {
            ...prevState,
          };
        }
      } else {
        return {
          ...prevState,
          selectedPhotoIndices: prevState.selectedPhotoIndices.filter(
            (item) => item !== index
          ),
        };
      }
    });
  }, []);

  const renderPhotos = useCallback(
    ({ item, index }: ListRenderItemInfo<LocalMediaParams>) => {
      const selectionIndex = state.selectedPhotoIndices.findIndex(
        (item) => item === index
      );

      return (
        <PhotoListItem
          {...item}
          index={index}
          isMultiSelectable={state.isMultiSelectable}
          selectionIndex={selectionIndex}
          onSelect={onSelect}
        />
      );
    },
    [state.isMultiSelectable, state.selectedPhotoIndices, onSelect]
  );

  useEffect(() => {
    if (albums.length > 0) {
      onAlbumSelect(0);
    }
  }, [albums, onAlbumSelect]);

  const onAvatarPress = useCallback(() => {
    const selectedPhotos = state.selectedPhotoIndices.map(
      (index) => media[index]
    );
    navigation.navigate("SelectedLocalPhotoPreview", { list: selectedPhotos });
  }, [navigation, state.selectedPhotoIndices, media]);

  const onTickPress = useCallback(() => {
    const selectedPhotos = state.selectedPhotoIndices.map(
      (index) => media[index]
    );
    navigation.navigate("PhotoUploadDetails", { list: selectedPhotos });
  }, [navigation, state.selectedPhotoIndices, media]);

  return (
    <AppContainer stretchToFill={true} selfAlignment="stretch">
      <StatusBar hidden={true} />
      <AppHeader
        leftContainerChild={
          <AppIcon name="cross" size="medium" foreground="black" />
        }
        middleContainerChild={
          <AppLabel
            text="Select Photo"
            size="large"
            style="bold"
            foreground="black"
          />
        }
      />
      <AppContainer
        selfAlignment="stretch"
        majorAxisAlignment="start"
        minorAxisAlignment="center"
        stretchToFill={true}
      >
        <FlatList
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={media}
          numColumns={3}
          getItemLayout={getItemLayout}
          keyExtractor={(item) => item.uri}
          renderItem={renderPhotos}
          extraData={state}
        />
        {state.selectedAlbumIndex > -1 && (
          <AppLabel
            text={albums[state.selectedAlbumIndex]}
            type="solid"
            gap="small"
            corner="small-round"
            background="white"
            foreground="black"
            styleProp={{ position: "absolute", top: 12 }}
          />
        )}
        {media.length > 1 && (
          <AppIcon
            name="select"
            type="solid"
            background={state.isMultiSelectable ? "#3f71f2" : "white"}
            foreground={state.isMultiSelectable ? "white" : "black"}
            size="small"
            styleProp={styles.selectIcon}
            onPress={onMultiSelectToggle}
          />
        )}
        {state.selectedPhotoIndices.length > 0 && (
          <AppIcon
            name="tick"
            styleProp={styles.tickIcon}
            foreground="white"
            background="#3f71f2"
            type="solid"
            size="small"
            onPress={onTickPress}
          />
        )}
        {state.selectedPhotoIndices.length > 0 && (
          <AppAvatar
            size="small"
            hasRing={true}
            type="active"
            {...media[state.selectedPhotoIndices[0]]}
            styleProp={styles.avatar}
            onPress={onAvatarPress}
          />
        )}
      </AppContainer>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
  tickIcon: {
    position: "absolute",
    bottom: SIZE_14,
  },
  selectIcon: {
    position: "absolute",
    bottom: SIZE_14,
    right: SIZE_6,
  },
  avatar: {
    position: "absolute",
    bottom: SIZE_14,
    left: SIZE_6,
  },
});
