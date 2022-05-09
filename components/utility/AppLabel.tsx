import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import {
  TEXT_EXTRA_LARGE_SIZE,
  TEXT_LARGE_SIZE,
  TEXT_MEDIUM_SIZE,
  TEXT_SMALL_SIZE,
} from "../../constants/constants";
import { AppLabelProps } from "../../constants/types";
import { AppContainer } from "./AppContainer";

export function AppLabel({
  text,
  size,
  style,
  gap,
  corner,
  type,
  selfAlignment,
  bounces,
  onPress,
  background,
  foreground,
  styleProp,
  borderSize,
  hasUnderline,
}: AppLabelProps) {
  size = size ? size : "medium";
  style = style ? style : "medium";
  foreground = foreground ? foreground : "white";
  background = background ? background : "#3f71f2";

  const {
    fontSize,
    fontFamily,
    padding,
    borderRadius,
    backgroundColor,
    borderColor,
    borderWidth,
  } = useMemo(() => {
    let fontSize = 0;
    let fontFamily = "";
    let padding = 0;
    let borderRadius = 0;
    let backgroundColor = "";
    let borderColor = "";
    let borderWidth = 0;

    switch (size) {
      case "small":
        fontSize = TEXT_SMALL_SIZE;
        break;
      case "medium":
        fontSize = TEXT_MEDIUM_SIZE;
        break;
      case "large":
        fontSize = TEXT_LARGE_SIZE;
        break;
      case "extra-large":
        fontSize = TEXT_EXTRA_LARGE_SIZE;
        break;
    }

    switch (style) {
      case "medium":
        fontFamily = "roboto-medium";
        break;
      case "bold":
        fontFamily = "roboto-bold";
        break;
      case "regular":
        fontFamily = "roboto-regular";
        break;
    }

    switch (gap) {
      case "small":
        padding = 6;
        break;
      case "large":
        padding = 12;
        break;
      default:
        padding = 0;
    }

    switch (corner) {
      case "small-round":
        borderRadius = 6;
        break;
      case "large-round":
        borderRadius = 18;
        break;
      default:
        borderRadius = 0;
    }

    switch (type) {
      case "solid":
        backgroundColor = background!;
        borderColor = "transparent";
        break;
      case "outline":
        backgroundColor = "transparent";
        borderColor = foreground!;
        break;
      default:
        backgroundColor = "transparent";
        borderColor = "transparent";
    }

    switch (borderSize) {
      case "small":
        borderWidth = 2 * StyleSheet.hairlineWidth;
        break;
      case "large":
        borderWidth = 4 * StyleSheet.hairlineWidth;
        break;
      default:
        borderWidth = 0;
    }

    return {
      fontSize,
      fontFamily,
      padding,
      borderRadius,
      borderColor,
      backgroundColor,
      borderWidth,
    };
  }, [size, style, gap, corner, type, background, foreground, borderSize]);

  return (
    <AppContainer
      paddingTop={padding}
      paddingBottom={padding}
      paddingLeft={padding}
      paddingRight={padding}
      borderRadius={borderRadius}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      styleProp={styleProp}
      selfAlignment={selfAlignment}
      borderWidth={borderWidth}
      onPress={onPress}
      isAnimated={bounces}
    >
      <Text
        style={[
          {
            fontFamily,
            fontSize,
            lineHeight: fontSize,
            color: foreground,
            alignSelf: "center",
            textDecorationLine: hasUnderline ? "underline" : "none",
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {text}
      </Text>
    </AppContainer>
  );
}
