import { useLayout } from "@react-native-community/hooks";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SCREEN_WIDTH, SIZE_5, SIZE_6 } from "../../constants/constants";

export type AppHeader = {
  leftContainerChild?: ReactNode;
  rightContainerChild?: ReactNode;
  middleContainerChild?: ReactNode;
  hasBorder?: boolean;
  float?: boolean;
};

export function AppHeader({
  leftContainerChild,
  middleContainerChild,
  rightContainerChild,
  hasBorder,
  float,
}: AppHeader) {
  const { width: leftContainerWidth, onLayout: onLeftContainerLayout } =
    useLayout();
  const { width: rightContainerWidth, onLayout: onRightContainerLayout } =
    useLayout();

  return (
    <View
      style={{
        width: SCREEN_WIDTH,

        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "nowrap",
        flexDirection: "row",
        borderBottomWidth: hasBorder ? StyleSheet.hairlineWidth : 0,
        paddingHorizontal: SIZE_5,
        paddingVertical: SIZE_6,
        position: float ? "absolute" : "relative",
      }}
    >
      {leftContainerChild && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: SIZE_5,
          }}
          onLayout={onLeftContainerLayout}
        >
          {leftContainerChild}
        </View>
      )}
      {middleContainerChild && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginLeft:
              rightContainerWidth > leftContainerWidth
                ? rightContainerWidth - leftContainerWidth + SIZE_5
                : 0,
            marginRight:
              leftContainerWidth > rightContainerWidth
                ? leftContainerWidth - rightContainerWidth + SIZE_5
                : 0,
          }}
        >
          {middleContainerChild}
        </View>
      )}
      {rightContainerChild && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: SIZE_5,
          }}
          onLayout={onRightContainerLayout}
        >
          {rightContainerChild}
        </View>
      )}
    </View>
  );
}
