import { useMemo } from "react";
import { View, ViewStyle } from "react-native";
import { AppContainerProps } from "../../constants/types";
import useAppSafeAreaInsets from "../../hooks/useAppSafeAreaInsets";
import { AppPressable } from "./AppPressable";

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
  activeOverlayColor,
  disabled,
  isAnimated,
  onPress,
}: AppContainerProps) {
  const { bottom, left, right, top } = useAppSafeAreaInsets();

  paddingBottom =
    (paddingBottom ? paddingBottom : 0) + (isBottomSafe ? bottom : 0);
  paddingTop = (paddingTop ? paddingTop : 0) + (isTopSafe ? top : 0);
  paddingLeft = (paddingLeft ? paddingLeft : 0) + (isLeftSafe ? left : 0);
  paddingRight = (paddingRight ? paddingRight : 0) + (isRightSafe ? right : 0);

  const { alignContent, alignItems, justifyContent, alignSelf } =
    useMemo(() => {
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

      return { alignItems, justifyContent, alignContent, alignSelf };
    }, [
      majorAxisAlignment,
      minorAxisAlignment,
      contentAlignment,
      selfAlignment,
    ]);

  const targetComponent = (
    <View
      style={[
        {
          flex:
            stretchToFill || (onPress && height !== undefined) ? 1 : undefined,
          justifyContent,
          alignContent,
          alignSelf: !onPress ? alignSelf : "stretch",
          alignItems,
          width: !onPress ? width : undefined,
          height: !onPress ? height : undefined,
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
        },
        !onPress ? styleProp : undefined,
      ]}
    >
      {children}
    </View>
  );

  return onPress ? (
    <AppPressable
      activeOverlayColor={activeOverlayColor}
      disabled={disabled}
      isAnimated={isAnimated}
      onPress={onPress}
      styleProp={[
        styleProp,
        {
          alignSelf,
          width,
          height,
          flex: stretchToFill ? 1 : undefined,
          borderRadius,
        },
      ]}
    >
      {targetComponent}
    </AppPressable>
  ) : (
    targetComponent
  );
}
