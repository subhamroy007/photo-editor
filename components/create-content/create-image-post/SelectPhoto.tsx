import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  SIZE_10,
  SIZE_16,
  SIZE_19,
  SIZE_5,
} from "../../../constants/constants";
import { ImageParams, LocalMediaParams } from "../../../constants/types";
import { useVideoProcessor } from "../../../hooks/useMediaProcessor";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppContainer } from "../../utility/AppContainer";
import { AppHeader } from "../../utility/AppHeader";
import { AppIcon } from "../../utility/AppIcon";
import { AppLabel } from "../../utility/AppLabel";
import { AppModal } from "../../utility/AppModal";
import { AppPressable } from "../../utility/AppPressable";
import { PhotoListItem } from "./PhotoListItem";

export type SelectPhotoProps = {};

export type SelectPhotoState = {
  directory: "local" | "draft";
  selectedAlbum: string;
  selectedPhotos: ImageParams[];
  isMultiSelectable: boolean;
  photos: LocalMediaParams[];
  albums: string[];
  isLoaded: boolean;
  isAlbumModalOpen: boolean;
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
    isAlbumModalOpen: false,
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
          selectedPhotos: [result.data.files[0]],
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
        if (prevState.isMultiSelectable) {
          return {
            ...prevState,
            selectedPhotos: prevState.selectedPhotos.filter(
              (item) => item.uri !== image.uri
            ),
          };
        } else {
          return {
            ...prevState,
          };
        }
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
    [onSelect, onMultiSelect, state]
  );

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
    setState((prevState) => {
      return {
        ...prevState,
        directory: "local",
        isAlbumModalOpen: prevState.directory === "draft" ? false : true,
      };
    });
  }, []);

  const filteredPhotos = useMemo(() => {
    if (state.directory === "draft") {
      return state.photos.filter((photo) => photo.album === "draft");
    } else {
      if (state.selectedAlbum === "Gallery") {
        return state.photos.filter((photo) => photo.album !== "draft");
      } else {
        return state.photos.filter(
          (photo) => photo.album === state.selectedAlbum
        );
      }
    }
  }, [state.selectedAlbum, state.directory, state.photos]);

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
        majorAxisAlignment="between"
      >
        <AppContainer contentOrientation="row" majorAxisAlignment="start">
          <AppPressable disableLongPress={true} onTap={onAlbumLabelTap}>
            <AppLabel
              text={state.selectedAlbum}
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
        <AppPressable disableLongPress={true} onTap={onMultiSelectIconTap}>
          <AppIcon
            name="select"
            size="extra-small"
            type={state.isMultiSelectable ? "solid" : "outline"}
            foreground={state.isMultiSelectable ? "white" : "black"}
            background={state.isMultiSelectable ? undefined : "white"}
            borderSize="small"
          />
        </AppPressable>
      </AppContainer>
      <FlatList
        getItemLayout={getItemLayout}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={filteredPhotos}
        keyExtractor={(item) => item.uri}
        numColumns={4}
        renderItem={renderPhotos}
        extraData={state}
        removeClippedSubviews={true}
        initialNumToRender={0}
      />

      <AppIcon
        name="camera"
        size="small"
        type="solid"
        styleProp={styles.cameraIcon}
      />

      {state.isAlbumModalOpen && (
        <AppModal height={600} title="Albums">
          <ScrollView
            style={{ flex: 1, alignSelf: "stretch" }}
            showsVerticalScrollIndicator={false}
          >
            {state.albums.map((album) => {
              return (
                <AppPressable
                  styleProp={{ alignSelf: "stretch" }}
                  disableLongPress={true}
                  onTap={() => {
                    setState((prevState) => ({
                      ...prevState,
                      selectedAlbum: album,
                      isAlbumModalOpen: false,
                    }));
                  }}
                  overlayColor="#e1e1e1"
                  disableTap={state.selectedAlbum === album}
                  key={album}
                >
                  <AppLabel
                    text={album}
                    selfAlignment="stretch"
                    gap="large"
                    type="solid"
                    foreground={
                      state.selectedAlbum === album ? "grey" : "black"
                    }
                    background="transparent"
                    style="regular"
                  />
                </AppPressable>
              );
            })}
          </ScrollView>
        </AppModal>
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
    backgroundColor: "white",
  },
  cameraIcon: { position: "absolute", bottom: SIZE_5 * 6 },
  draftLabel: { marginLeft: SIZE_5 },
});
