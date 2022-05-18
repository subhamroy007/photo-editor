import CameraRoll, { AssetType } from "@react-native-community/cameraroll";
import { useCallback, useEffect } from "react";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";
import { LocalMediaParams } from "../constants/types";
import * as FileSystem from "expo-file-system";
import { generateTimestampString } from "../constants/utility";

export function useVideoProcessor() {
  useEffect(() => {
    RNFFmpegConfig.disableLogs();
  }, []);

  const generateThumbnail = useCallback(
    async (
      uri: string,
      timestamp: number = 1000
    ): Promise<{ status: "completed"; data: string } | { status: "error" }> => {
      try {
        const outputFileName = `${
          FileSystem.cacheDirectory
        }thumbnail@${Date.now()}.png`;

        const frameTimestamp = generateTimestampString(timestamp);

        const executionId = await RNFFmpeg.executeWithArguments([
          "-i",
          uri,
          "-ss",
          frameTimestamp,
          "-vframes 1",
          outputFileName,
        ]);

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

        let firstFile: null | LocalMediaParams = null;

        if (result.length > 0) {
          const thumbnailResult = result[0].node.image.playableDuration
            ? await generateThumbnail(result[0].node.image.uri)
            : null;

          if (thumbnailResult && thumbnailResult.status === "error") {
            throw new Error();
          }

          firstFile = {
            album: result[0].node.group_name,
            duration: result[0].node.image.playableDuration,
            height: result[0].node.image.height,
            time: result[0].node.timestamp + "",
            uri: result[0].node.image.uri,
            width: result[0].node.image.width,
            thumbnailUri: thumbnailResult ? thumbnailResult.data : null,
          };
        }

        return {
          status: "completed",
          data: firstFile,
        };
      } catch (error: any) {
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
          data: { albums: string[]; files: LocalMediaParams[] };
        }
      | { status: "error" }
    > => {
      try {
        const albumQueryResult = await CameraRoll.getAlbums({
          assetType: type,
        });

        const albumNames = ["Gallery"];
        const totalMediaFilesCount = albumQueryResult.reduce(
          (sum, currAlbum) => {
            albumNames.push(currAlbum.title);
            return sum + currAlbum.count;
          },
          0
        );

        const { edges: result } = await CameraRoll.getPhotos({
          first: 100,
          assetType: type,
          groupTypes: "All",
          include: ["imageSize", "playableDuration"],
          mimeTypes: ["image/jpeg", "image/png", "video/mp4"],
        });

        let mediaFiles: LocalMediaParams[] = [];

        result.forEach(async (item) => {
          const thumbnailResult = item.node.image.playableDuration
            ? await generateThumbnail(item.node.image.uri)
            : null;

          if (thumbnailResult && thumbnailResult.status === "error") {
            throw new Error();
          }

          mediaFiles.push({
            album: item.node.group_name,
            duration: item.node.image.playableDuration,
            height: item.node.image.height,
            time: item.node.timestamp + "",
            uri: item.node.image.uri,
            width: item.node.image.width,
            thumbnailUri: thumbnailResult ? thumbnailResult.data : null,
          });
        });

        return {
          status: "completed",
          data: {
            albums: albumNames,
            files: mediaFiles,
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

  return {
    fetchFirstLocalMediaFile,
    fetchAllLocalMediaFile,
    generateThumbnail,
  };
}
