import { StyleSheet } from "react-native";
import {
  COLOR_11,
  COLOR_12,
  COLOR_13,
  COLOR_9,
  COLOR_7,
  COLOR_8,
  SIZE_12,
  SIZE_14,
  SIZE_3,
  SIZE_4,
  SIZE_5,
  SIZE_6,
  SIZE_7,
  SIZE_8,
  SIZE_9,
  COLOR_6,
  COLOR_5,
  COLOR_19,
} from "./constants";

export const globalStyles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  flexWrap: {
    flexWrap: "wrap",
  },
  alignCenter: {
    alignItems: "center",
  },
  alignStart: {
    alignItems: "flex-start",
  },
  alignEnd: {
    alignItems: "flex-end",
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
  justifyEnd: {
    justifyContent: "flex-end",
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
  alignSelfEnd: {
    alignSelf: "flex-end",
  },
  alignSelfCenter: {
    alignSelf: "center",
  },
  alignContentStretch: {
    alignContent: "stretch",
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  lineHeightUndefined: {
    lineHeight: undefined,
  },
  primaryLightBackgroundColor: {
    backgroundColor: COLOR_8,
  },
  primaryDarkBackgroundColor: {
    backgroundColor: COLOR_7,
  },
  primaryDarkForegroundColor: {
    backgroundColor: COLOR_7,
  },
  secondaryLightBackgroundColor: {
    backgroundColor: COLOR_13,
  },
  secondaryDarkBackgroundColor: {
    backgroundColor: COLOR_12,
  },
  secondaryDarkForegroundColor: {
    backgroundColor: COLOR_12,
  },
  secondaryLightForegroundColor: {
    backgroundColor: COLOR_13,
  },
  primaryDarkBorderColor: {
    borderColor: COLOR_5,
  },
  primaryLightBorderColor: {
    borderColor: COLOR_19,
  },
  primaryTopBorderWidth: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  primaryBottomBorderWidth: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  secondaryTopBorderWidth: {
    borderTopWidth: 2 * StyleSheet.hairlineWidth,
  },
  secondaryBottomBorderWidth: {
    borderBottomWidth: 2 * StyleSheet.hairlineWidth,
  },
  semiTransparentBackgroundColor1: {
    backgroundColor: COLOR_6,
  },
  semiTransparentBackgroundColor2: {
    backgroundColor: COLOR_11,
  },
  semiTransparentBackgroundColor3: {
    backgroundColor: COLOR_9,
  },
  paddingHorizontalSize1: {
    paddingHorizontal: SIZE_7,
  },
  paddingHorizontalSize2: {
    paddingHorizontal: SIZE_4,
  },
  paddingHorizontalSize3: {
    paddingHorizontal: SIZE_8,
  },
  paddingHorizontalSize4: {
    paddingHorizontal: SIZE_5,
  },
  paddingHorizontalSize5: {
    paddingHorizontal: SIZE_3,
  },
  paddingHorizontalSize6: {
    paddingHorizontal: SIZE_6,
  },
  paddingHorizontalSize7: {
    paddingHorizontal: SIZE_9,
  },
  paddingHorizontalSize8: {
    paddingHorizontal: SIZE_14,
  },
  paddingHorizontalSize9: {
    paddingHorizontal: SIZE_12,
  },
  paddingVerticalSize1: {
    paddingVertical: SIZE_7,
  },
  paddingVerticalSize2: {
    paddingVertical: SIZE_4,
  },
  paddingVerticalSize3: {
    paddingVertical: SIZE_8,
  },
  paddingVerticalSize4: {
    paddingVertical: SIZE_5,
  },
  paddingVerticalSize5: {
    paddingVertical: SIZE_3,
  },
  paddingVerticalSize6: {
    paddingVertical: SIZE_6,
  },
  paddingVerticalSize7: {
    paddingVertical: SIZE_9,
  },
  paddingVerticalSize8: {
    paddingVertical: SIZE_14,
  },
  paddingVerticalSize9: {
    paddingVertical: SIZE_12,
  },
  marginLeftSize1: {
    marginLeft: SIZE_7,
  },
  marginRightSize1: {
    marginRight: SIZE_7,
  },
  marginTopSize1: {
    marginTop: SIZE_7,
  },
  marginBottomSize1: {
    marginBottom: SIZE_7,
  },
  marginLeftSize2: {
    marginLeft: SIZE_4,
  },
  marginRightSize2: {
    marginRight: SIZE_4,
  },
  marginTopSize2: {
    marginTop: SIZE_4,
  },
  marginBottomSize2: {
    marginBottom: SIZE_4,
  },
  marginLeftSize3: {
    marginLeft: SIZE_8,
  },
  marginRightSize3: {
    marginRight: SIZE_8,
  },
  marginTopSize3: {
    marginTop: SIZE_8,
  },
  marginBottomSize3: {
    marginBottom: SIZE_8,
  },
  marginLeftSize4: {
    marginLeft: SIZE_5,
  },
  marginRightSize4: {
    marginRight: SIZE_5,
  },
  marginTopSize4: {
    marginTop: SIZE_5,
  },
  marginBottomSize4: {
    marginBottom: SIZE_5,
  },
  marginLeftSize5: {
    marginLeft: SIZE_3,
  },
  marginRightSize5: {
    marginRight: SIZE_3,
  },
  marginTopSize5: {
    marginTop: SIZE_3,
  },
  marginBottomSize5: {
    marginBottom: SIZE_3,
  },
  marginLeftSize6: {
    marginLeft: SIZE_6,
  },
  marginRightSize6: {
    marginRight: SIZE_6,
  },
  marginTopSize6: {
    marginTop: SIZE_6,
  },
  marginBottomSize6: {
    marginBottom: SIZE_6,
  },
  marginLeftSize7: {
    marginLeft: SIZE_9,
  },
  marginRightSize7: {
    marginRight: SIZE_9,
  },
  marginTopSize7: {
    marginTop: SIZE_9,
  },
  marginBottomSize7: {
    marginBottom: SIZE_9,
  },
  marginLeftSize8: {
    marginLeft: SIZE_14,
  },
  marginRightSize8: {
    marginRight: SIZE_14,
  },
  marginTopSize8: {
    marginTop: SIZE_14,
  },
  marginBottomSize8: {
    marginBottom: SIZE_14,
  },
  marginLeftSize9: {
    marginLeft: SIZE_12,
  },
  marginRightSize9: {
    marginRight: SIZE_12,
  },
  marginTopSize9: {
    marginTop: SIZE_12,
  },
  marginBottomSize9: {
    marginBottom: SIZE_12,
  },
  borderTopRadiusSize3: {
    borderTopStartRadius: SIZE_5,
    borderTopEndRadius: SIZE_5,
  },
  borderBottomRadiusSize3: {
    borderBottomStartRadius: SIZE_5,
    borderBottomEndRadius: SIZE_5,
  },
});
