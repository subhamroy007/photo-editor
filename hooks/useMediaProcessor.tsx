import CameraRoll, { AssetType } from "@react-native-community/cameraroll";
import { useCallback, useEffect } from "react";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";
import { AppErrorParams, LocalMediaParams } from "../constants/types";
import * as FileSystem from "expo-file-system";
import { generateTimestampString } from "../constants/utility";
import { MEMORY_CLEAN_UP_ERROR_CODE } from "../constants/constants";

export function useMediaProcessor() {
  useEffect(() => {
    RNFFmpegConfig.disableLogs();
  }, []);

  const trimVideo = useCallback(
    async (
      uri: string,
      start: number,
      end: number
    ): Promise<{ status: "completed"; data: string } | { status: "error" }> => {
      try {
        const outputFileName = `${
          FileSystem.cacheDirectory
        }trim@${Date.now()}.mp4`;

        const startTimestamp = generateTimestampString(start);
        const endTimestamp = generateTimestampString(end);

        const executionId = await RNFFmpeg.executeWithArguments([
          "-i",
          uri,
          "-ss",
          startTimestamp,
          "-to",
          endTimestamp,
          "-c:v",
          "copy",
          "-c:a",
          "copy",
          outputFileName,
        ]);

        return { status: "completed", data: outputFileName };
      } catch (error: any) {
        return {
          status: "error",
        };
      }
    },
    []
  );

  const generateThumbnail = useCallback(
    async (
      uri: string,
      timestamp?: number,
      interval?: number,
      width?: number,
      height?: number
    ): Promise<{ status: "completed"; data: string } | { status: "error" }> => {
      try {
        const outputFileName = timestamp
          ? `${FileSystem.cacheDirectory}thumbnail@${Date.now()}.png`
          : `${FileSystem.cacheDirectory}thumbnail-directory@${Date.now()}/`;

        let executionId = -1;

        if (timestamp) {
          const frameTimestamp = generateTimestampString(timestamp);
          executionId = await RNFFmpeg.executeWithArguments([
            "-i",
            uri,
            "-ss",
            frameTimestamp,
            "-frames:v",
            "1",
            outputFileName,
          ]);
        } else {
          executionId = await RNFFmpeg.execute(
            `-i ${uri} ${interval ? "-vf fps=" + 1 / interval : ""} ${
              width && height ? "-s " + width + "x" + height : ""
            } ${outputFileName}thubmnail%d.png`
          );
        }

        return {
          status: "completed",
          data: outputFileName,
        };
      } catch (error: any) {
        return {
          status: "error",
        };
      }
    },
    []
  );

  const fetchFirstLocalMediaFile = useCallback(
    async (
      type: AssetType
    ): Promise<
      | { status: "completed"; data: LocalMediaParams | null }
      | { status: "error" }
    > => {
      try {
        const { edges: result } = await CameraRoll.getPhotos({
          first: 1,
          assetType: type,
          groupTypes: "All",
          include: ["imageSize", "playableDuration"],
          mimeTypes: ["image/jpeg", "image/png", "video/mp4"],
        });

        if (result.length > 0) {
          const {
            node: {
              group_name: mediaAlbum,
              image: {
                height: mediaHeight,
                playableDuration: mediaDuration,
                uri: mediaUri,
                width: mediaWidth,
              },
              timestamp: mediaTimestamp,
            },
          } = result[0];
          let thumbnailUri = "";
          let previewUri = "";
          if (mediaDuration !== null) {
            if (mediaDuration > 60000) {
              previewUri = mediaUri;
            }
            const thumbnailGenerationResult = await generateThumbnail(
              mediaUri,
              1000
            );
            if (thumbnailGenerationResult.status === "error") {
              throw new Error();
            } else {
              thumbnailUri = thumbnailGenerationResult.data;
            }
          }

          return {
            status: "completed",
            data: {
              album: mediaAlbum,
              duration: mediaDuration !== null ? mediaDuration : 0,
              height: mediaHeight,
              width: mediaWidth,
              uri: mediaUri,
              timestamp: mediaTimestamp,
              thumbnail: {
                uri: thumbnailUri,
                width: thumbnailUri === "" ? 0 : mediaWidth,
                height: thumbnailUri === "" ? 0 : mediaHeight,
              },
              preview: {
                uri: previewUri,
                width: previewUri === "" ? 0 : mediaWidth,
                height: previewUri === "" ? 0 : mediaHeight,
                duration: previewUri === "" ? 0 : mediaDuration!,
              },
            },
          };
        }

        //return null data with completed status
        return {
          status: "completed",
          data: null,
        };
      } catch (error: any) {
        //return error status
        return {
          status: "error",
        };
      }
    },
    []
  );

  const fetchAllLocalMediaFile = useCallback(
    async (
      type: AssetType
    ): Promise<
      | {
          status: "completed";
          data: {
            albums: { title: string; count: number; mediaIndex: number }[];
            medias: LocalMediaParams[];
          };
        }
      | { status: "error" }
    > => {
      try {
        const albumQueryResult = await CameraRoll.getAlbums({
          assetType: type,
        });

        const albumList: {
          title: string;
          count: number;
          mediaIndex: number;
        }[] = [{ count: 0, mediaIndex: -1, title: "Gallery" }];

        let totalMediaCount = 0;

        albumQueryResult.forEach((albumItem) => {
          totalMediaCount += albumItem.count;
          albumList.push({ ...albumItem, mediaIndex: -1 });
        });

        const { edges: result } = await CameraRoll.getPhotos({
          first: 60,
          assetType: type,
          groupTypes: "All",
          include: ["imageSize", "playableDuration"],
          mimeTypes: ["image/jpeg", "image/png", "video/mp4"],
        });

        let mediaList: LocalMediaParams[] = [];

        result.forEach(async (item, index) => {
          const {
            node: {
              group_name: mediaAlbum,
              image: {
                height: mediaHeight,
                playableDuration: mediaDuration,
                uri: mediaUri,
                width: mediaWidth,
              },
              timestamp: mediaTimestamp,
            },
          } = item;

          if (index === 0) {
            albumList[0].mediaIndex = 0;
          } else {
            const albumIndex = albumList.findIndex(
              (albumItem) => albumItem.title === mediaAlbum
            );
            if (albumList[albumIndex].mediaIndex === -1) {
              albumList[albumIndex].mediaIndex = index;
            }
          }

          let thumbnailUri = "";
          let previewUri = "";
          if (mediaDuration !== null) {
            if (mediaDuration > 60000) {
              previewUri = mediaUri;
            }
            const thumbnailGenerationResult = await generateThumbnail(
              mediaUri,
              1000
            );
            if (thumbnailGenerationResult.status === "error") {
              throw new Error();
            } else {
              thumbnailUri = thumbnailGenerationResult.data;
            }
          }

          mediaList.push({
            album: mediaAlbum,
            duration: mediaDuration !== null ? mediaDuration : 0,
            height: mediaHeight,
            width: mediaWidth,
            uri: mediaUri,
            timestamp: mediaTimestamp,
            thumbnail: {
              uri: thumbnailUri,
              width: thumbnailUri === "" ? 0 : mediaWidth,
              height: thumbnailUri === "" ? 0 : mediaHeight,
            },
            preview: {
              uri: previewUri,
              width: previewUri === "" ? 0 : mediaWidth,
              height: previewUri === "" ? 0 : mediaHeight,
              duration: previewUri === "" ? 0 : mediaDuration!,
            },
          });
        });

        return {
          status: "completed",
          data: {
            albums: albumList,
            medias: mediaList,
          },
        };
      } catch (error: any) {
        return {
          status: "error",
        };
      }
    },
    []
  );

  const deleteFile = useCallback(
    async (
      uri: string
    ): Promise<
      | { status: "completed"; data: string }
      | { status: "error"; data: AppErrorParams }
    > => {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        return {
          status: "completed",
          data: uri,
        };
      } catch (error) {
        return {
          status: "error",
          data: {
            code: MEMORY_CLEAN_UP_ERROR_CODE,
            message: "memory error",
            reasons: {},
          },
        };
      }
    },
    []
  );

  return {
    fetchFirstLocalMediaFile,
    fetchAllLocalMediaFile,
    generateThumbnail,
    trimVideo,
    deleteFile,
  };
}
