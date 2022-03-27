import { Album } from "@react-native-community/cameraroll";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimatedSpinner } from "../components/AnimatedSpinner";
import { Modal } from "../components/Modal";
import { SelectableImageGalleryItem } from "../components/SelectableImageGalleryItem";
import {
  fetchPhotos,
  getPhotoAlbums,
  hasAndroidPermission,
} from "../constants/helper";
import { Feather } from "@expo/vector-icons";
import {
  Photo,
  PhotoAlbum,
  PhotoFetchResult,
  PhotoSelectScreenState,
} from "../constants/types";
import { SCREEN_WIDTH } from "../constants/constants";
import { PhotoGallery, PhotoInfo } from "../components/PhotoGallery";
import FastImage from "react-native-fast-image";

export type Action =
  | {
      type: "photo_select/init";
      payload: {
        albums: PhotoAlbum[];
        photoFetchResult: PhotoFetchResult;
      };
    }
  | {
      type: "photo_select/select_deselect_photo";
      payload: {
        uri: string;
      };
    }
  | {
      type: "photo_select/switch_album";
      payload: {
        title: string;
        photoFetchResult?: PhotoFetchResult;
      };
    }
  | {
      type: "photo_select/add_photo";
      payload: {
        title: string;
        photoFetchResult: PhotoFetchResult;
      };
    };

export function reducer(
  state: PhotoSelectScreenState,
  action: Action
): PhotoSelectScreenState {
  let albumMap: PhotoSelectScreenState["albums"] = {};
  let photoMap: PhotoSelectScreenState["photos"] = {};
  let photo: Photo | null = null;
  let album: PhotoAlbum | null = null;

  switch (action.type) {
    case "photo_select/init":
      albumMap = {};
      action.payload.albums.forEach((album) => (albumMap[album.title] = album));
      photoMap = {};
      action.payload.photoFetchResult.photos.forEach((photo) => {
        if (!state.photos[photo.uri]) {
          photoMap[photo.uri] = photo;
        }
      });
      album = albumMap["Gallery"];
      if (!album) {
        return state;
      }
      album.photos = [
        ...album.photos,
        ...action.payload.photoFetchResult.photos.map((photo) => photo.uri),
      ];
      album.endCursor =
        action.payload.photoFetchResult.endCursor === -1
          ? album.count
          : action.payload.photoFetchResult.endCursor;
      album.hasNextPage = action.payload.photoFetchResult.hasNextPage;

      albumMap["Gallery"] = album;
      return {
        ...state,
        selectedAlbumTitle: "Gallery",
        albums: {
          ...state.albums,
          ...albumMap,
        },
        photos: {
          ...state.photos,
          ...photoMap,
        },
      };
    case "photo_select/select_deselect_photo":
      photo = state.photos[action.payload.uri];
      if (!photo) {
        return state;
      }
      photo.isSelected = !photo.isSelected;
      let selectedPhotos = state.selectedPhotos;
      if (photo.isSelected) {
        selectedPhotos.push(photo.uri);
      } else {
        selectedPhotos = selectedPhotos.filter((uri) => uri !== photo!.uri);
      }
      return {
        ...state,
        photos: {
          ...state.photos,
          [photo.uri]: photo,
        },
        selectedPhotos,
      };
    case "photo_select/switch_album":
      if (!action.payload.photoFetchResult) {
        return {
          ...state,
          selectedAlbumTitle: action.payload.title,
        };
      }
      album = state.albums[action.payload.title];
      if (!album) {
        return state;
      }
      photoMap = {};
      action.payload.photoFetchResult.photos.forEach((photo) => {
        if (!state.photos[photo.uri]) {
          photoMap[photo.uri] = photo;
        }
      });
      album.photos = [
        ...album.photos,
        ...action.payload.photoFetchResult.photos.map((photo) => photo.uri),
      ];
      album.endCursor =
        action.payload.photoFetchResult.endCursor === -1
          ? album.count
          : action.payload.photoFetchResult.endCursor;
      album.hasNextPage = action.payload.photoFetchResult.hasNextPage;

      return {
        ...state,
        selectedAlbumTitle: action.payload.title,
        photos: {
          ...state.photos,
          ...photoMap,
        },
        albums: {
          ...state.albums,
          [album.title]: album,
        },
      };
    case "photo_select/add_photo":
      album = state.albums[action.payload.title];
      if (!album) {
        return state;
      }
      photoMap = {};
      action.payload.photoFetchResult.photos.forEach((photo) => {
        if (!state.photos[photo.uri]) {
          photoMap[photo.uri] = photo;
        }
      });
      album.photos = [
        ...album.photos,
        ...action.payload.photoFetchResult.photos.map((photo) => photo.uri),
      ];
      album.endCursor =
        action.payload.photoFetchResult.endCursor === -1
          ? album.count
          : action.payload.photoFetchResult.endCursor;
      album.hasNextPage = action.payload.photoFetchResult.hasNextPage;
      return {
        ...state,
        albums: {
          ...state.albums,
          [album.title]: album,
        },
        photos: {
          ...state.photos,
          ...photoMap,
        },
      };
  }
}

export function PhotoSelectScreen() {
  const [state, dispatch] = useReducer(reducer, {
    albums: {},
    photos: {},
    selectedAlbumTitle: "",
    selectedPhotos: [],
  });

  const references = useRef<{
    selectedPhotoIndex: number;
    selectedPhotoList: Photo[];
  }>({ selectedPhotoIndex: 0, selectedPhotoList: [] });

  const [isModalOpen, setModalOpen] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const [isGalleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      //check for the permission to access external storage
      if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        return;
      }

      //get all the albums that contains photos
      const albums = await getPhotoAlbums();

      //get first batch of photos
      const photoFetchResult = await fetchPhotos("Gallery", 0);

      dispatch({
        type: "photo_select/init",
        payload: { albums, photoFetchResult },
      });
    };
    init();
  }, []);

  const onModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const onModalOpen = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onGalleryClose = useCallback(() => {
    setGalleryOpen(false);
  }, []);

  const onItemPress = useCallback((item: string, index: number) => {
    dispatch({
      type: "photo_select/select_deselect_photo",
      payload: { uri: item },
    });
  }, []);

  const onItemLongPress = useCallback(
    (item: string, index: number) => {
      references.current.selectedPhotoList = state.selectedPhotos.map(
        (uri) => state.photos[uri]!
      );
      references.current.selectedPhotoIndex =
        state.selectedPhotos.indexOf(item);
      setGalleryOpen(true);
    },
    [state]
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => {
      const inLastRow =
        Math.floor(index / 3) ===
        Math.floor(
          (state.albums[state.selectedAlbumTitle]!.photos.length - 1) / 3
        );
      const seletionNumber = state.photos[item]?.isSelected
        ? state.selectedPhotos.indexOf(item) + 1
        : -1;

      return (
        <SelectableImageGalleryItem
          uri={item}
          index={index}
          inLastRow={inLastRow}
          onLongPress={onItemLongPress}
          onPress={onItemPress}
          selectionNumber={seletionNumber}
          key={item}
        />
      );
    },
    [state, onItemLongPress, onItemPress]
  );

  const onSwitchSelectedAlbum = useCallback(
    async (title: string) => {
      const album = state.albums[title]!;
      if (album.endCursor > 0) {
        console.log(
          "just changing album with photo length " + album.photos.length
        );
        dispatch({ type: "photo_select/switch_album", payload: { title } });
      } else if (album.endCursor === 0 && album.hasNextPage) {
        const photoFetchResult = await fetchPhotos(title, album.endCursor);

        dispatch({
          type: "photo_select/switch_album",
          payload: { title, photoFetchResult },
        });
      }
      onModalClose();
    },
    [state, onModalClose]
  );

  const onEndReachCallback = useCallback(async () => {
    const album = state.albums[state.selectedAlbumTitle];

    if (album && album.hasNextPage && !isLoading) {
      setLoading(true);
      const photoFetchResult = await fetchPhotos(album.title, album.endCursor);
      dispatch({
        type: "photo_select/add_photo",
        payload: { title: album.title, photoFetchResult },
      });
      setLoading(false);
    }
  }, [state, isLoading]);

  const getItemLayout = useCallback(
    (_: string[] | null | undefined, index: number) => {
      return {
        index: index,
        offset: (index * SCREEN_WIDTH) / 3,
        length: SCREEN_WIDTH / 3,
      };
    },
    []
  );

  const albumTitles = Object.keys(state.albums);
  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={"dark-content"}
      />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: StatusBar.currentHeight,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "#d1cbcb",
          paddingBottom: 12,
        }}
      >
        <View style={{ marginLeft: 18 }}>
          <Entypo name="cross" size={30} color="black" />
        </View>
        <View>
          <Text style={{ fontSize: 18 }}>{"Select Photo"}</Text>
        </View>
        <View style={{ marginRight: 18 }}>
          <AntDesign name="arrowright" size={30} color="black" />
        </View>
      </View>
      {state.selectedAlbumTitle !== "" && (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 18,
            paddingVertical: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap",
          }}
        >
          <Pressable
            onPress={onModalOpen}
            style={{
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "center",
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            pressRetentionOffset={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <Text
              style={{
                fontSize: 18,
              }}
            >
              {state.albums[state.selectedAlbumTitle]?.title}
            </Text>
            <Feather name="chevron-down" size={24} color="black" />
          </Pressable>
          <Feather name="camera" size={24} color="black" />
        </View>
      )}
      <FlatList
        data={
          state.selectedAlbumTitle !== ""
            ? state.albums[state.selectedAlbumTitle]!.photos
            : []
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
        numColumns={3}
        keyExtractor={(item, index) => item}
        extraData={isLoading}
        onEndReachedThreshold={0.2}
        onEndReached={onEndReachCallback}
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <View
            style={{
              flexWrap: "nowrap",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: 12,
              marginTop: 100,
            }}
          >
            <AnimatedSpinner />
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View
              style={{
                flexWrap: "nowrap",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: 12,
              }}
            >
              <AnimatedSpinner />
            </View>
          ) : undefined
        }
      />

      {isModalOpen && (
        <Modal onClose={onModalClose} title="select album">
          {albumTitles.map((album, index) => {
            return (
              <Pressable
                style={{
                  width: "100%",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                key={album}
                onPress={() => {
                  onSwitchSelectedAlbum(album);
                }}
                disabled={state.selectedAlbumTitle === album}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color:
                      state.selectedAlbumTitle === album ? "grey" : "black",
                  }}
                >
                  {album}
                </Text>
              </Pressable>
            );
          })}
        </Modal>
      )}
      {isGalleryOpen && (
        <PhotoGallery
          photos={references.current.selectedPhotoList}
          initIndex={references.current.selectedPhotoIndex}
          onClose={onGalleryClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
