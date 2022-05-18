import { View, ViewStyle } from "react-native";
import { AppContainerProps } from "../../constants/types";
import useAppSafeAreaInsets from "../../hooks/useAppSafeAreaInsets";

export function AppContainer({
  backgroundColor,
  borderBottomWidth,
  borderColor,
  borderRadius,
  borderTopWidth,
  borderWidth,
  children,
  contentAlignment,
  contentOrientation,
  height,
  isBottomSafe,
  isLeftSafe,
  isRightSafe,
  isTopSafe,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  width,
  wrapContent,
  borderTopRadius,
  majorAxisAlignment,
  minorAxisAlignment,
  selfAlignment,
  stretchToFill,
  styleProp,
  borderBottomRadius,
}: AppContainerProps) {
  const { bottom, left, right, top } = useAppSafeAreaInsets();

  paddingBottom =
    (paddingBottom ? paddingBottom : 0) + (isBottomSafe ? bottom : 0);
  paddingTop = (paddingTop ? paddingTop : 0) + (isTopSafe ? top : 0);
  paddingLeft = (paddingLeft ? paddingLeft : 0) + (isLeftSafe ? left : 0);
  paddingRight = (paddingRight ? paddingRight : 0) + (isRightSafe ? right : 0);

  let alignItems: ViewStyle["alignItems"] = "center";
  let justifyContent: ViewStyle["justifyContent"] = "center";
  let alignContent: ViewStyle["alignContent"] = "center";
  let alignSelf: ViewStyle["alignSelf"] = undefined;

  switch (majorAxisAlignment) {
    case "around":
      justifyContent = "space-around";
      break;
    case "between":
      justifyContent = "space-between";
      break;
    case "evenly":
      justifyContent = "space-evenly";
      break;
    case "end":
      justifyContent = "flex-end";
      break;
    case "start":
      justifyContent = "flex-start";
      break;
  }

  switch (minorAxisAlignment) {
    case "end":
      alignItems = "flex-end";
      break;
    case "start":
      alignItems = "flex-start";
      break;
    case "stretch":
      alignItems = "stretch";
      break;
  }

  switch (contentAlignment) {
    case "around":
      alignContent = "space-around";
      break;
    case "between":
      alignContent = "space-between";
      break;
    case "stretch":
      alignContent = "stretch";
      break;
    case "end":
      alignContent = "flex-end";
      break;
    case "start":
      alignContent = "flex-start";
      break;
  }

  switch (selfAlignment) {
    case "end":
      alignSelf = "flex-end";
      break;
    case "start":
      alignSelf = "flex-start";
      break;
    case "stretch":
      alignSelf = "stretch";
      break;
    case "center":
      alignSelf = "center";
      break;
  }

  return (
    <View
      style={[
        {
          flex: stretchToFill ? 1 : undefined,
          justifyContent,
          alignContent,
          alignSelf,
          alignItems,
          width: width,
          height: height,
          backgroundColor,
          borderColor,
          borderWidth,
          borderRadius,
          borderTopEndRadius: borderTopRadius,
          borderTopStartRadius: borderTopRadius,
          borderTopWidth,
          borderBottomWidth,
          flexWrap: wrapContent ? "wrap" : "nowrap",
          flexDirection: contentOrientation,
          paddingBottom,
          paddingTop,
          paddingLeft,
          paddingRight,
          borderBottomEndRadius: borderBottomRadius,
          borderBottomStartRadius: borderBottomRadius,
        },
        styleProp,
      ]}
    >
      {children}
    </View>
  );
}
