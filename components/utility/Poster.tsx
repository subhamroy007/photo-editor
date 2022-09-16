import { Image, StyleSheet } from "react-native";
import { SIZE_37, SIZE_9 } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { MediaParams } from "../../constants/types";

export type PosterProps = {
  image: MediaParams;
  size?: "size-1" | "size-2";
};

export function Poster({ image, size }: PosterProps) {
  let containerSize = 0;
  let strokeSize = 0;

  switch (size) {
    case "size-1":
      containerSize = SIZE_9;
      strokeSize = 3 * StyleSheet.hairlineWidth;
      break;
    case "size-2":
    default:
      containerSize = SIZE_37;
      strokeSize = 4 * StyleSheet.hairlineWidth;
      break;
  }

  return (
    <Image
      style={[
        {
          width: containerSize,
          height: containerSize,
          borderWidth: strokeSize,
        },
        globalStyles.secondaryLightBackgroundColor,
        globalStyles.secondaryLightBorderColor,
        globalStyles.borderBottomRadiusSize2,
        globalStyles.borderTopRadiusSize2,
      ]}
      resizeMode="cover"
      source={image}
      fadeDuration={0}
    />
  );
}
