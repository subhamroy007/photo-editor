import {
  AssetType,
  getAlbums,
  getPhotos,
} from "@react-native-community/cameraroll";
import { PermissionsAndroid } from "react-native";
import { ResizeMode } from "react-native-fast-image";
import {
  Photo,
  PhotoAlbum,
  PhotoFetchResult,
  PhotoRenderConfig,
} from "./types";

export async function hasAndroidPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === "granted";
}

export async function fetchPhotos(
  albumTitle: string,
  end: number
): Promise<PhotoFetchResult> {
  const result = await getPhotos({
    assetType: "Photos",
    groupTypes: albumTitle === "Gallery" ? "All" : "Album",
    groupName: albumTitle !== "Gallery" ? albumTitle : undefined,
    mimeTypes: ["image/jpeg", "image/png"],
    first: 24,
    after: end + "",
    include: ["imageSize"],
  });

  const photos = result.edges.map<Photo>((edge) => ({
    uri: edge.node.image.uri,
    height: edge.node.image.height,
    isSelected: false,
    timestamp: edge.node.timestamp,
    width: edge.node.image.width,
  }));

  return {
    photos,
    endCursor: result.page_info.end_cursor
      ? parseInt(result.page_info.end_cursor)
      : -1,
    hasNextPage: result.page_info.has_next_page,
  };
}

export async function getPhotoAlbums(): Promise<PhotoAlbum[]> {
  const albums = await getAlbums({ assetType: "Photos" });

  let totalPhotoCount = 0;
  let photoAlbums = albums.map<PhotoAlbum>((album) => {
    totalPhotoCount += album.count;

    return {
      count: album.count,
      title: album.title,
      endCursor: 0,
      hasNextPage: true,
      photos: [],
    };
  });
  photoAlbums = [
    {
      count: totalPhotoCount,
      endCursor: 0,
      hasNextPage: totalPhotoCount > 0,
      photos: [],
      title: "Gallery",
    },
    ...photoAlbums,
  ];

  return photoAlbums;
}

export const getImageConfig = (
  maxWidth: number,
  minWidth: number,
  originalWidth: number,
  maxHeight: number,
  minHeight: number,
  originalHeigth: number
): PhotoRenderConfig => {
  const aspectRatio = originalHeigth / originalWidth;
  let containerWidth = originalWidth;
  if (containerWidth > maxWidth) {
    containerWidth = maxWidth;
  } else if (containerWidth < minWidth) {
    containerWidth = minWidth;
  }

  let containerHeight = containerWidth * aspectRatio;

  if (containerHeight > maxHeight) {
    containerHeight = maxHeight;
  } else if (containerHeight < minHeight) {
    containerHeight = minHeight;
  }

  let resizeMode: ResizeMode = "center";

  if (originalWidth >= containerWidth && originalHeigth >= containerHeight) {
    resizeMode = "cover";
  } else if (
    originalWidth < containerWidth &&
    originalHeigth < containerHeight
  ) {
    resizeMode = "center";
  } else {
    resizeMode = "contain";
  }

  return { height: containerHeight, width: containerWidth, resizeMode };
};
