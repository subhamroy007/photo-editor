import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SIZE_1, SIZE_8, SIZE_9 } from "../../constants/constants";
import { MediaParams } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";

export type PhotoListItemProps = {
  index: number;
  selectionIndex: number;
  isMultiSelectable: boolean;
  onSelect: (index: number) => void;
} & MediaParams;

export const PhotoListItem = React.memo<PhotoListItemProps>(
  ({ uri, index, isMultiSelectable, selectionIndex, onSelect }) => {
    const onPress = useCallback(() => {
      onSelect(index);
    }, [onSelect, index]);

    return (
      <AppContainer
        width={SIZE_1}
        height={SIZE_1}
        paddingBottom={StyleSheet.hairlineWidth * 2}
        paddingTop={StyleSheet.hairlineWidth * 2}
        paddingLeft={index % 3 > 0 ? StyleSheet.hairlineWidth * 2 : 0}
        paddingRight={index % 3 < 2 ? StyleSheet.hairlineWidth * 2 : 0}
        onPress={onPress}
      >
        <FastImage
          source={{ cache: "immutable", priority: "high", uri }}
          resizeMode="cover"
          style={styles.photo}
        />
        {selectionIndex >= 0 && (
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(200)}
          >
            <AppIcon name="tick" size="medium" />
          </Animated.View>
        )}
        {isMultiSelectable && (
          <AppContainer
            backgroundColor={selectionIndex >= 0 ? "#3f71f2" : "transparent"}
            borderRadius={SIZE_9 / 2}
            width={SIZE_9}
            height={SIZE_9}
            styleProp={styles.selectionCounter}
            borderWidth={2 * StyleSheet.hairlineWidth}
            borderColor="white"
            majorAxisAlignment="center"
            minorAxisAlignment="center"
          >
            {selectionIndex >= 0 && <AppLabel text={selectionIndex + 1 + ""} />}
          </AppContainer>
        )}
      </AppContainer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.uri === nextProps.uri &&
      prevProps.isMultiSelectable === nextProps.isMultiSelectable &&
      prevProps.selectionIndex === nextProps.selectionIndex &&
      prevProps.onSelect === nextProps.onSelect
    );
  }
);

const styles = StyleSheet.create({
  photo: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionCounter: { position: "absolute", top: SIZE_8, right: SIZE_8 },
});
