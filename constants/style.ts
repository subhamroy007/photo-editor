import { StyleSheet } from "react-native";
import { COLOR_11, COLOR_8 } from "./constants";

export const globalStyles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  alignCenter: {
    alignItems: "center",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  justifyEven: {
    justifyContent: "space-evenly",
  },
  justifyAround: {
    justifyContent: "space-around",
  },
  absolutePosition: {
    position: "absolute",
  },
  stretchSelf: {
    alignSelf: "stretch",
  },
  alignSelfStart: {
    alignSelf: "flex-start",
  },
  flex1: {
    flex: 1,
  },
  lineHeightUndefined: {
    lineHeight: undefined,
  },
  primaryLightBackgroundColor: {
    backgroundColor: COLOR_8,
  },
  semitransparentBackgroundColor: {
    backgroundColor: COLOR_11,
  },
});
