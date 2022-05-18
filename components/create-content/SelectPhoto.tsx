import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { SIZE_10, SIZE_16, SIZE_19, SIZE_5 } from "../../constants/constants";
import { LocalMediaParams } from "../../constants/types";
import { useVideoProcessor } from "../../hooks/useVideoProcessor";
import { AppContainer } from "../utility/AppContainer";
import { AppHeader } from "../utility/AppHeader";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";
import { PhotoListItem } from "./PhotoListItem";

export type SelectPhotoProps = {};

export type SelectPhotoState = {
  directory: "local" | "draft";
  selectedAlbum: string;
  selectedPhotos: LocalMediaParams[];
  isMultiSelectable: boolean;
  photos: LocalMediaParams[];
  albums: string[];
  isLoaded: boolean;
};

export function SelectPhoto({}: SelectPhotoProps) {
  const [state, setState] = useState<SelectPhotoState>({
    directory: "local",
    selectedAlbum: "Gallery",
    selectedPhotos: [],
    isMultiSelectable: false,
    albums: [],
    photos: [],
    isLoaded: false,
  });

  const { fetchAllLocalMediaFile } = useVideoProcessor();

  useEffect(() => {
    const init = async () => {
      setState((prevState) => ({ ...prevState, isLoaded: false }));
      const result = await fetchAllLocalMediaFile("Photos");
      if (result.status === "completed") {
        setState((prevState) => ({
          ...prevState,
          albums: result.data.albums,
          photos: result.data.files,
          isLoaded: true,
        }));
      } else {
        setState((prevState) => ({ ...prevState, isLoaded: true }));
      }
    };
    init();
  }, []);

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

  const onSelect = useCallback((image: LocalMediaParams) => {
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

  const onMultiSelect = useCallback((image: LocalMediaParams) => {
    setState((prevState) => ({
      ...prevState,
      isMultiSelectable: true,
      selectedPhotos: [image],
    }));
  }, []);

  const renderPhotos = useCallback(
    ({ item, index }: ListRenderItemInfo<LocalMediaParams>) => {
      if (
        (state.directory === "draft" && item.album === "draft") ||
        (state.directory === "local" &&
          (state.selectedAlbum === "Gallery" ||
            state.selectedAlbum === item.album))
      ) {
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
      } else {
        return null;
      }
    },
    [onSelect, onMultiSelect, state]
  );

  const listEmptyComponent = useCallback(() => {
    return !state.isLoaded ? null : (
      <AppContainer selfAlignment="stretch" height={SIZE_19}>
        <AppIcon
          name="landscape"
          size="large"
          foreground="#9f9f9f"
          type="outline"
          borderSize="small"
        />
        <AppLabel
          text="No Photos Available"
          size="extra-large"
          foreground="#9f9f9f"
          styleProp={{ marginTop: SIZE_10 }}
        />
      </AppContainer>
    );
  }, [state.isLoaded]);

  const onMultiSelectIconTap = useCallback(() => {
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

  const onDraftLabelTap = useCallback(() => {
    setState((prevState) => ({ ...prevState, directory: "draft" }));
  }, []);

  const onAlbumLabelTap = useCallback(() => {
    setState((prevState) => ({ ...prevState, directory: "local" }));
  }, []);

  return (
    <AppContainer
      stretchToFill={true}
      selfAlignment="stretch"
      majorAxisAlignment="start"
      backgroundColor="white"
    >
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
        paddingBottom={SIZE_5}
        paddingLeft={SIZE_5}
        paddingRight={SIZE_5}
        paddingTop={SIZE_5}
        contentOrientation="row"
        majorAxisAlignment="start"
      >
        <AppPressable disableLongPress={true} onTap={onAlbumLabelTap}>
          <AppLabel
            text="Gallery"
            corner="large-round"
            style="medium"
            size="medium"
            type={state.directory === "local" ? "solid" : "outline"}
            gap="small"
            foreground={state.directory === "local" ? "white" : "black"}
            borderSize="small"
          />
        </AppPressable>
        <AppPressable
          disableLongPress={true}
          onTap={onDraftLabelTap}
          styleProp={styles.draftLabel}
        >
          <AppLabel
            text="Draft"
            corner="large-round"
            style="medium"
            size="medium"
            type={state.directory === "draft" ? "solid" : "outline"}
            borderSize="small"
            foreground={state.directory === "draft" ? "white" : "black"}
            gap="small"
          />
        </AppPressable>
      </AppContainer>
      <FlatList
        getItemLayout={getItemLayout}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={state.photos}
        keyExtractor={(item) => item.uri}
        numColumns={4}
        renderItem={renderPhotos}
        ListEmptyComponent={listEmptyComponent}
        extraData={state}
        removeClippedSubviews={true}
        initialNumToRender={0}
      />

      <AppIcon
        name="camera"
        size="small"
        type="solid"
        styleProp={{ position: "absolute", bottom: SIZE_5, left: SIZE_5 }}
      />
      <AppPressable
        disableLongPress={true}
        onTap={onMultiSelectIconTap}
        styleProp={styles.multiSelectIcon}
      >
        <AppIcon
          name="select"
          size="small"
          type="solid"
          foreground={state.isMultiSelectable ? "white" : "black"}
          background={state.isMultiSelectable ? undefined : "white"}
        />
      </AppPressable>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "white",
  },
  multiSelectIcon: { position: "absolute", bottom: SIZE_5, right: SIZE_5 },
  draftLabel: { marginLeft: SIZE_5 },
});
