import CameraRoll from "@react-native-community/cameraroll";
import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid } from "react-native";
import { LocalMediaHookState, LocalMediaParams } from "../constants/types";

export function useLocalMedia() {
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

      const albums = await CameraRoll.getAlbums({ assetType: "All" });

      let albumTitles = ["Gallery"];
      let albumMediaCount = 0;

      albums.forEach((album) => {
        albumTitles.push(album.title);
        albumMediaCount += album.count;
      });

      const mediaListResult = await CameraRoll.getPhotos({
        first: 100,
        assetType: "All",
        groupTypes: "All",
        include: ["imageSize", "playableDuration"],
        mimeTypes: ["image/jpeg", "image/png", "video/mp4"],
      });

      const mediaList: LocalMediaParams[] = [];

      mediaListResult.edges.forEach((item) => {
        const mediaItem: LocalMediaParams = {
          album: item.node.group_name,
          height: item.node.image.height,
          uri: item.node.image.uri,
          width: item.node.image.width,
          duration: item.node.image.playableDuration!,
          time: item.node.timestamp + "",
        };

        mediaList.push(mediaItem);
      });

      setState((prevState) => ({
        ...prevState,
        albums: albumTitles,
        media: mediaList,
        isLoading: false,
      }));
    } catch (e: any) {
      setState((prevState) => ({
        ...prevState,
        isError: true,
        isLoading: false,
      }));
    }
  }, [state.hasReadPermission]);

  return { ...state, fetchMedia };
}
