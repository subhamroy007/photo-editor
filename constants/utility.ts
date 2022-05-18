import { Extrapolate, interpolate } from "react-native-reanimated";
import { DAY_IN_MILISECONDS, SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants";
import { RNFFmpeg, RNFFprobe } from "react-native-ffmpeg";
import * as FileSystem from "expo-file-system";
import {
  EffectPlaceHolder,
  MediaOptions,
  MediaParams,
  Property,
  TransitionParams,
  TransitionProperty,
} from "./types";

export function evaluateEffectString(input: string) {
  const inputSegments = input.split(" ");
  const outputSegments = [""];
  inputSegments.forEach((segment) => {
    if (segment.startsWith("$")) {
      switch (segment as EffectPlaceHolder) {
        case "$SCREEN_HEIGHT":
          outputSegments.push(SCREEN_HEIGHT + "");
          break;
        case "$SCREEN_WIDTH":
          outputSegments.push(SCREEN_WIDTH + "");
          break;
      }
    } else {
      outputSegments.push(segment);
    }
  });
  return outputSegments.join(" ");
}

export function evaluateNumber(input: string) {
  const data = eval(evaluateEffectString(input));
  if (typeof data === "number" && isFinite(data) && !isNaN(data)) {
    return data;
  }
  return 0;
}

export function getTransitionRange(
  input: TransitionParams[],
  initialOutputRangeValue: number
) {
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  const typeRange: ("linear" | "jump")[] = [];
  let initialInputRangeValue = 0;
  inputRange.push(initialInputRangeValue);
  outputRange.push(initialOutputRangeValue);
  for (let i = 0; i < input.length; i++) {
    typeRange.push(input[i].type);
    initialInputRangeValue += input[i].duration;
    initialOutputRangeValue =
      typeof input[i].to === "number"
        ? (input[i].to as number)
        : evaluateNumber(input[i].to as string);
    inputRange.push(initialInputRangeValue);
    outputRange.push(initialOutputRangeValue);
  }
  return {
    inputRange,
    outputRange,
    typeRange,
  };
}

export function getTransitionValue(
  input: number,
  inputRange: number[],
  outputRange: number[],
  typeRange: ("linear" | "jump")[],
  repeat: boolean
) {
  let index = 0;
  input = !repeat ? input : input % inputRange[inputRange.length - 1];
  while (index !== typeRange.length - 1) {
    if (input >= inputRange[index] && input <= inputRange[index + 1]) {
      break;
    }
    index++;
  }

  if (typeRange[index] === "linear") {
    const output = interpolate(
      input,
      [inputRange[index], inputRange[index + 1]],
      [outputRange[index], outputRange[index + 1]],
      Extrapolate.CLAMP
    );
    return output;
  }
  if (input >= inputRange[index] && input < inputRange[index + 1]) {
    return outputRange[index];
  }
  return outputRange[index + 1];
}

export function evaluatePropertyValue(
  property: number | TransitionProperty,
  timestamp: number
) {
  if (typeof property === "number") {
    return property;
  } else {
    const result = getTransitionValue(
      timestamp,
      property.inputRange,
      property.outputRange,
      property.typeRange,
      property.repeat
    );
    return result;
  }
}

// export async function downloadMedia(
//   texture: MediaParams
// ): Promise<MediaOptions> {
//   const outputDir =
//     FileSystem.cacheDirectory +
//     "texture-" +
//     texture.name +
//     "-" +
//     Date.now() +
//     "/";

//   const outputFile =
//     texture.mediaType === "video" ? `frame-%d.png` : "frame.png";

//   const info = await RNFFprobe.getMediaInformation(texture.uri);
//   const videoStream = (info.getAllProperties()["streams"] as any)[0];
//   const noOfFrames = Math.floor(parseInt(videoStream["nb_frames"]));
//   const duration = Math.floor(parseInt(videoStream["duration"]) * 1000);
//   const width = Math.floor(parseInt(videoStream["width"]));
//   const height = Math.floor(parseInt(videoStream["height"]));

//   await FileSystem.makeDirectoryAsync(outputDir, { intermediates: true });
//   const result = await RNFFmpeg.executeWithArguments([
//     "-i",
//     texture.uri,
//     outputDir + outputFile,
//   ]);
//   if (result !== 0) {
//     throw new Error("error");
//   }
//   return {
//     duration: isNaN(duration) ? 0 : duration,
//     frame: isNaN(noOfFrames) ? 0 : noOfFrames,
//     height,
//     localUri:
//       texture.mediaType === "video" ? outputDir : outputDir + outputFile,
//     width,
//     name: texture.name,
//     type: texture.mediaType,
//   };
// }

export function fromPropertyToNumberOrTransitionProperty(
  value: Property
): number | TransitionProperty {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return evaluateNumber(value);
  }
  const initValue =
    typeof value.initValue === "number"
      ? value.initValue
      : evaluateNumber(value.initValue);
  const { inputRange, outputRange, typeRange } = getTransitionRange(
    value.transitions,
    initValue
  );
  return {
    inputRange,
    outputRange,
    typeRange,
    repeat: value.repeat,
  };
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "September",
  "October",
  "November",
  "December",
];

export function getDate(timestamp: number) {
  const currentDate = new Date();
  const targetDate = new Date(timestamp);

  if (
    currentDate.getDate() === targetDate.getDate() &&
    currentDate.getTime() - timestamp < DAY_IN_MILISECONDS
  ) {
    return "Today";
  } else if (
    currentDate.getDate() === targetDate.getDate() + 1 &&
    currentDate.getTime() - timestamp < 2 * DAY_IN_MILISECONDS
  ) {
    return "Yestarday";
  } else {
    return (
      `${MONTHS[targetDate.getMonth()]} ${targetDate.getDate() + 1}` +
      (targetDate.getFullYear() < currentDate.getFullYear()
        ? " " + targetDate.getFullYear()
        : "")
    );
  }
}

export function generateTimestampString(timestamp: number) {
  const miliseconds = timestamp % 1000;
  const totalSeconds = Math.floor(timestamp / 1000);
  const seconds = totalSeconds % 60;
  const totalMins = Math.floor(totalSeconds / 60);
  const mins = totalMins % 60;
  const hours = Math.floor(totalMins / 60);

  return `${hours > 9 ? "" + hours : "0" + hours}:${
    mins > 9 ? "" + mins : "0" + mins
  }:${seconds > 9 ? "" + seconds : "0" + seconds}:${
    miliseconds > 99
      ? "" + miliseconds
      : miliseconds > 9
      ? "0" + miliseconds
      : "00" + miliseconds
  }`;
}
