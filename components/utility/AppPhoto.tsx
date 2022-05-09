import { useMemo } from "react";
import { Image, StyleProp, ViewStyle } from "react-native";
import FastImage, { ResizeMode } from "react-native-fast-image";
import { MediaParams } from "../../constants/types";
import { AppContainer } from "./AppContainer";

export type AppPhotoProps = {
  media: MediaParams;
  style: "fill" | "dynamic";
  boxWidth: number;
  boxHeight: number;
  gap?: number;
  styleProp?: StyleProp<ViewStyle>;
  bounces?: boolean;
  onPress?: () => void;
};

export function AppPhoto({
  boxHeight,
  boxWidth,
  media: { height, uri, width },
  style,
  gap,
  bounces,
  onPress,
  styleProp,
}: AppPhotoProps) {
  const { imageHeight, imageWidth, resizeMode } = useMemo(() => {
    let resizeMode: ResizeMode | undefined;
    let imageWidth: number | string = 0;
    let imageHeight: number | string = 0;

    if (style === "fill") {
      resizeMode = "cover";
      imageWidth = "100%";
      imageHeight = "100%";
    } else if (height < boxHeight && width < boxWidth) {
      //base case where the image is too small to scale
      resizeMode = "center";
      imageWidth = width;
      imageHeight = height;
    } else if (boxWidth > boxHeight) {
      //when the bounding box is in landscape resolution

      if (width > height) {
        //when the photo itself is in landscape resolution
        if (width >= boxWidth && height >= boxHeight) {
          //when the photo is too large to fit
          resizeMode = "cover";
          imageWidth = boxHeight;
          imageHeight = boxHeight;
        } else {
          // in all other unusual cases
          resizeMode = "contain";
          imageWidth = Math.min(boxWidth, width);
          imageHeight = boxWidth * (height / width);
        }
      } else {
        //when the photo is portrait scaledown to fit the landscape box
        resizeMode = "contain";
        imageHeight = boxHeight;
        imageWidth = boxHeight * (width / height);
      }
    } else {
      //when the bounding box is in portrait format
      if (width > height) {
        //when the photo is in landscape format scale down to fit the portrait box
        resizeMode = "contain";
        imageWidth = boxWidth;
        imageHeight = (boxWidth * height) / width;
      } else {
        //when the photo is portrait itself
        if (width > boxWidth && height > boxHeight) {
          //if the photo is too large to fit
          resizeMode = "cover";
          imageWidth = boxWidth;
          imageHeight = boxHeight;
        } else {
          // in all other unusual cases
          resizeMode = "contain";
          imageHeight = Math.min(boxHeight, boxHeight);
          imageWidth = (boxHeight * width) / height;
        }
      }
    }

    return { resizeMode, imageWidth, imageHeight };
  }, [style, boxWidth, boxHeight]);

  return (
    <AppContainer
      styleProp={styleProp}
      isAnimated={bounces}
      onPress={onPress}
      width={boxWidth}
      height={boxHeight}
      paddingBottom={gap}
      paddingLeft={gap}
      paddingRight={gap}
      paddingTop={gap}
      majorAxisAlignment="center"
      minorAxisAlignment="center"
    >
      {style === "dynamic" && (
        <Image
          source={{ uri, width, height }}
          resizeMode="cover"
          style={{ width: boxWidth, height: boxHeight, position: "absolute" }}
          blurRadius={30}
        />
      )}
      <FastImage
        source={{ uri, cache: "immutable", priority: "high" }}
        resizeMode={resizeMode}
        style={{
          width: imageWidth,
          height: imageHeight,
          backgroundColor: "#e1e1e1",
        }}
      />
    </AppContainer>
  );
}
