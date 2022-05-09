import React from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import Svg, { Rect } from "react-native-svg";
import { SCREEN_WIDTH } from "../../constants/constants";
import { MediaParams } from "../../constants/types";
import { AppPressable } from "../utility/AppPressable";

const ITEM_SIZE = Math.round(SCREEN_WIDTH / 5);

export type PhotoPreviewBottomListItemProps = {
  isFocused: boolean;
  onPress: () => void;
} & MediaParams;

export const PhotoPreviewBottomListItem =
  React.memo<PhotoPreviewBottomListItemProps>(
    ({ uri, isFocused, onPress }) => {
      return (
        <AppPressable
          isAnimated={false}
          onPress={onPress}
          contentContainerStyle={styles.container}
        >
          <FastImage
            source={{ cache: "immutable", priority: "high", uri }}
            resizeMode="cover"
            style={styles.image}
          />
          <View
            style={[
              styles.stroke,
              { borderColor: isFocused ? "white" : "transparent" },
            ]}
          />
        </AppPressable>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.isFocused === nextProps.isFocused &&
        prevProps.onPress === nextProps.onPress
      );
    }
  );

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    padding: StyleSheet.hairlineWidth * 10,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey",
    borderRadius: StyleSheet.hairlineWidth * 20,
  },
  stroke: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 20 * StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth * 4,
    position: "absolute",
  },
});
