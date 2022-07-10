import { StyleSheet, Text } from "react-native";
import {
  COLOR_1,
  COLOR_7,
  COLOR_8,
  SIZE_10,
  SIZE_23,
  SIZE_25,
  SIZE_4,
  SIZE_5,
  SIZE_6,
  SIZE_7,
  SIZE_8,
} from "../../constants/constants";
import { AppLabelProps } from "../../constants/types";

export function AppLabel({
  text,
  size,
  style,
  gap,
  corner,
  background,
  foreground,
  styleProp,
  hasUnderline,
  isBackgroundVisible,
  isBorderVisible,
  noOfLines,
  onPress,
  alignment,
  gapHorizontal,
  gapVertical,
}: AppLabelProps) {
  let fontSize = 0;
  let fontFamily = "";
  let padding = 0;
  let paddingHorizontal = 0;
  let paddingVertical = 0;
  let borderRadius = 0;
  let backgroundColor = "";
  let foregroundColor = foreground
    ? foreground
    : isBackgroundVisible
    ? COLOR_8
    : COLOR_7;

  switch (size) {
    case "medium":
      fontSize = SIZE_10;
      break;
    case "large":
      fontSize = SIZE_6;
      break;
    case "extra-large":
      fontSize = SIZE_23;
      break;
    case "extra-small":
      fontSize = SIZE_5;
      break;
    case "small":
    default:
      fontSize = SIZE_25;
      break;
  }

  switch (style) {
    case "bold":
      fontFamily = "roboto-bold";
      break;
    case "regular":
      fontFamily = "roboto-regular";
      break;
    case "medium":
    default:
      fontFamily = "roboto-medium";
      break;
  }

  switch (gap) {
    case "extra-small":
      padding = SIZE_7;
      break;
    case "small":
      padding = SIZE_4;
      break;
    case "medium":
      padding = SIZE_8;
      break;
    case "large":
      padding = SIZE_5;
      break;
    default:
      padding = 0;
  }

  switch (gapHorizontal) {
    case "extra-small":
      paddingHorizontal = SIZE_7;
      break;
    case "small":
      paddingHorizontal = SIZE_4;
      break;
    case "medium":
      paddingHorizontal = SIZE_8;
      break;
    case "large":
      paddingHorizontal = SIZE_5;
      break;
    default:
      paddingHorizontal = 0;
  }

  switch (gapVertical) {
    case "extra-small":
      paddingVertical = SIZE_7;
      break;
    case "small":
      paddingVertical = SIZE_4;
      break;
    case "medium":
      paddingVertical = SIZE_8;
      break;
    case "large":
      paddingVertical = SIZE_5;
      break;
    default:
      paddingVertical = 0;
  }

  switch (corner) {
    case "small-round":
      borderRadius = SIZE_4;
      break;
    case "large-round":
      borderRadius = SIZE_5;
      break;
    default:
      borderRadius = 0;
  }

  if (isBackgroundVisible) {
    backgroundColor = background ? background : COLOR_1;
  } else {
    backgroundColor = "transparent";
  }

  return (
    <Text
      onPress={onPress}
      style={[
        {
          fontFamily,
          fontSize,
          textDecorationLine: hasUnderline ? "underline" : "none",
          borderWidth: isBorderVisible ? 2 * StyleSheet.hairlineWidth : 0,
          backgroundColor,
          color: foregroundColor,
          borderColor: isBackgroundVisible ? foregroundColor : undefined,
          paddingVertical: gapVertical ? paddingVertical : undefined,
          paddingHorizontal: gapHorizontal ? paddingHorizontal : undefined,
          padding: gap ? padding : undefined,
          borderRadius: borderRadius,
          textAlignVertical: noOfLines && noOfLines > 1 ? "top" : "center",
          textAlign:
            alignment === undefined
              ? noOfLines && noOfLines > 1
                ? "left"
                : "center"
              : alignment,
          lineHeight: noOfLines && noOfLines > 1 ? undefined : fontSize,
        },
        styleProp,
      ]}
      numberOfLines={noOfLines ? noOfLines : 1}
      ellipsizeMode="tail"
    >
      {text}
    </Text>
  );
}
