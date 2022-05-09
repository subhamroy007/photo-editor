import { useCallback, useEffect, useState } from "react";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";
import * as FileSystem from "expo-file-system";
import { MediaOptions, MediaParams, MediaState } from "../constants/types";
import { downloadMedia } from "../constants/utility";

export function useMedia(medias: MediaParams[]) {
  const [state, setState] = useState<MediaState>({
    error: false,
    loaded: false,
    mediaMap: {},
  });

  useEffect(() => {
    let mediaMap: { [key: string]: MediaOptions } = {};
    const prepare = async () => {
      RNFFmpegConfig.disableLogs();

      try {
        for (let i = 0; i < medias.length; i++) {
          const result = await downloadMedia(medias[i]);
          mediaMap[result.name] = result;
        }
        setState({ error: false, loaded: true, mediaMap });
      } catch (error: any) {
        setState({ error: true, loaded: false, mediaMap: {} });
      }
    };
    prepare();
    return () => {
      RNFFmpeg.cancel();
      Object.values(mediaMap).forEach((media) =>
        FileSystem.deleteAsync(media.localUri, { idempotent: true })
      );
    };
  }, [medias]);

  return state;
}
