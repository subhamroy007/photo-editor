import CameraRoll from "@react-native-community/cameraroll";
import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid } from "react-native";
import { MediaParams } from "../constants/types";

export type LocalMediaParams = {
  album: string;
} & MediaParams;

export type LocalMediaHookState = {
  albums: string[];
  media: LocalMediaParams[];
  isLoading: boolean;
  isError: boolean;
  hasReadPermission: boolean;
  hasWritePermission: boolean;
};

export function useLocalMedia(type: "All" | "Photos" | "Videos") {
  const [state, setState] = useState<LocalMediaHookState>({
    albums: [],
    media: [],
    isError: false,
    isLoading: false,
    hasReadPermission: false,
    hasWritePermission: false,
  });

  useEffect(() => {
    const prepare = async () => {
      let readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      let writePermission =
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      let readPermissionStatus = await PermissionsAndroid.check(readPermission);

      let writePermissionStatus = await PermissionsAndroid.check(
        writePermission
      );

      if (!readPermissionStatus) {
        readPermissionStatus =
          (await PermissionsAndroid.request(readPermission)) === "granted";
      }

      if (!writePermissionStatus) {
        writePermissionStatus =
          (await PermissionsAndroid.request(writePermission)) === "granted";
      }

      setState((prevState) => ({
        ...prevState,
        hasReadPermission: readPermissionStatus,
        hasWritePermission: writePermissionStatus,
      }));
    };
    prepare();
  }, []);

  const fetchMedia = useCallback(async () => {
    if (!state.hasReadPermission) {
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, isLoading: true }));

      const albums = await CameraRoll.getAlbums({ assetType: type });

      let albumTitles: string[] = [];
      let albumMediaCount = 0;

      albums.forEach((album) => {
        albumTitles.push(album.title);
        albumMediaCount += album.count;
      });

      const photos = await CameraRoll.getPhotos({
        first: 30,
        assetType: type,
        groupTypes: "All",
        include: ["imageSize"],
        mimeTypes: ["image/jpeg", "image/png", "video/mp4"],
      });

      let albumPhotos = photos.edges.map<LocalMediaParams>((photo) => ({
        album: photo.node.group_name,
        duration: photo.node.image.playableDuration,
        uri: photo.node.image.uri,
        height: photo.node.image.height,
        width: photo.node.image.width,
      }));
      setState((prevState) => ({
        ...prevState,
        albums: albumTitles,
        media: albumPhotos,
        isLoading: false,
      }));
    } catch (e: any) {
      setState((prevState) => ({
        ...prevState,
        isError: true,
        isLoading: false,
      }));
    }
  }, [type, state.hasReadPermission]);

  return { ...state, fetchMedia };
}
