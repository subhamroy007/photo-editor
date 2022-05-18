import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SIZE_15, SIZE_16, SIZE_6 } from "../../constants/constants";
import { AppIcon } from "../utility/AppIcon";
import { AppContainer } from "../utility/AppContainer";
import { AppLabel } from "../utility/AppLabel";
import { AppHeader } from "../utility/AppHeader";
import { ImageParams } from "../../constants/types";
import { PhotoListItem } from "./PhotoListItem";
import { LocalMediaParams, useLocalMedia } from "../../hooks/useLocalMedia";
import { AppAvatar } from "../utility/AppAvatar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackNavigationParams } from "../../navigators/RootStackNavigator";
import { useNavigation } from "@react-navigation/native";
import { AppPressable } from "../utility/AppPressable";

type ScreenProps = NativeStackScreenProps<
  RootStackNavigationParams,
  "CreateContent"
>;

export type PhotoListState = {
  selectedPhotos: ImageParams[];
  selectedAlbum: string;
  isMultiSelectable: boolean;
  isAlbumSwitchModalOpen: boolean;
};

export function PhotoList() {
  const navigation = useNavigation<ScreenProps["navigation"]>();

  const [state, setState] = useState<PhotoListState>({
    isMultiSelectable: false,
    isAlbumSwitchModalOpen: false,
    selectedAlbum: "",
    selectedPhotos: [],
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
        selectedPhotos:
          prevState.selectedPhotos.length === 0
            ? []
            : [prevState.selectedPhotos[0]],
      };
    });
  }, []);

  const toggleAlbumSwitchModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAlbumSwitchModalOpen: !prevState.isAlbumSwitchModalOpen,
    }));
  }, []);

  const onAlbumSelect = useCallback((value: string) => {
    setState((prevState) => ({
      ...prevState,
      selectedAlbum: value,
      isAlbumSwitchModalOpen: false,
    }));
  }, []);

  const onSelect = useCallback((image: ImageParams) => {
    setState((prevState) => {
      const selectionIndex = prevState.selectedPhotos.findIndex(
        (item) => item.uri === image.uri
      );

      if (selectionIndex === -1) {
        if (!prevState.isMultiSelectable) {
          return {
            ...prevState,
            selectedPhotos: [image],
          };
        } else if (prevState.selectedPhotos.length < 10) {
          return {
            ...prevState,
            selectedPhotos: [...prevState.selectedPhotos, image],
          };
        } else {
          return {
            ...prevState,
          };
        }
      } else {
        return {
          ...prevState,
          selectedPhotos: prevState.selectedPhotos.filter(
            (item) => item.uri !== image.uri
          ),
        };
      }
    });
  }, []);

  const onMultiSelect = useCallback((image: ImageParams) => {
    setState((prevState) => ({
      ...prevState,
      isMultiSelectable: true,
      selectedPhotos: [image],
    }));
  }, []);

  useEffect(() => {
    if (albums.length > 0) {
      setState((prevState) => ({
        ...prevState,
        selectedAlbum: albums[0],
        selectedPhotos: [media[0]],
      }));
    }
  }, [albums, media, onAlbumSelect, onSelect]);

  // const onAvatarPress = useCallback(() => {
  //   const selectedPhotos = state.selectedPhotoIndices.map(
  //     (index) => media[index]
  //   );
  //   navigation.navigate("SelectedLocalPhotoPreview", { list: selectedPhotos });
  // }, [navigation, state.selectedPhotoIndices, media]);

  // const onTickPress = useCallback(() => {
  //   const selectedPhotos = state.selectedPhotoIndices.map(
  //     (index) => media[index]
  //   );
  //   navigation.navigate("PhotoUploadDetails", { list: selectedPhotos });
  // }, [navigation, state.selectedPhotoIndices, media]);

  const getItemLayout = useCallback(
    (data: LocalMediaParams[] | null | undefined, index: number) => {
      return {
        index,
        length: SIZE_16,
        offset: index * SIZE_16,
      };
    },
    []
  );

  const renderPhotos = useCallback(
    ({ item, index }: ListRenderItemInfo<LocalMediaParams>) => {
      const selectionIndex = state.selectedPhotos.findIndex(
        (photo) => photo.uri === item.uri
      );

      return (
        <PhotoListItem
          {...item}
          isMultiSelectable={state.isMultiSelectable}
          selectionIndex={selectionIndex}
          onSelect={onSelect}
          image={item}
          styeProp={{
            paddingTop: StyleSheet.hairlineWidth * 2,
            paddingBottom: StyleSheet.hairlineWidth * 2,
            paddingLeft: index % 4 > 0 ? StyleSheet.hairlineWidth * 2 : 0,
            paddingRight: index % 4 < 3 ? StyleSheet.hairlineWidth * 2 : 0,
          }}
          onMultiSelect={onMultiSelect}
        />
      );
    },
    [state.isMultiSelectable, state.selectedPhotos, onSelect, onMultiSelect]
  );

  return (
    <AppContainer stretchToFill={true} selfAlignment="stretch">
      <StatusBar hidden={true} />
      <AppHeader
        leftContainerChild={
          <AppIcon name="cross" size="small" foreground="black" />
        }
        middleContainerChild={
          <AppLabel
            text="Select Photo"
            size="large"
            style="bold"
            foreground="black"
          />
        }
        rightContainerChild={
          <AppIcon name="tick" size="small" foreground="black" />
        }
      />
      <AppContainer
        selfAlignment="stretch"
        majorAxisAlignment="start"
        minorAxisAlignment="center"
        stretchToFill={true}
      >
        <FlatList
          data={media}
          getItemLayout={getItemLayout}
          renderItem={renderPhotos}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.uri}
          numColumns={4}
        />

        {!isLoading && !isError && (
          <AppLabel
            text={state.selectedAlbum}
            type="solid"
            gap="small"
            corner="small-round"
            background="white"
            foreground="black"
            styleProp={styles.albumLabel}
          />
        )}
        {media.length > 1 && (
          <AppPressable
            disableLongPress={true}
            onTap={onMultiSelectToggle}
            animateOnTouch={true}
            styleProp={styles.selectIcon}
          >
            <AppIcon
              name="select"
              type="solid"
              background={state.isMultiSelectable ? "#3f71f2" : "white"}
              foreground={state.isMultiSelectable ? "white" : "black"}
              size="small"
              onPress={onMultiSelectToggle}
            />
          </AppPressable>
        )}
        {!isLoading && !isError && (
          <AppAvatar
            size="small"
            hasRing={true}
            type="active"
            image={state.selectedPhotos[0]}
            styleProp={styles.avatar}
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
  selectIcon: {
    position: "absolute",
    bottom: SIZE_15,
    right: SIZE_6,
  },
  avatar: {
    position: "absolute",
    bottom: SIZE_15,
  },
  albumLabel: { position: "absolute", top: SIZE_6 },
});
