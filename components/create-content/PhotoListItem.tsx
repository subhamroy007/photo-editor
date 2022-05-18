import React, { useCallback } from "react";
import { Image, StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SIZE_16 } from "../../constants/constants";
import { ImageParams, LocalMediaParams } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";

export type PhotoListItemProps = {
  styeProp: StyleProp<ViewStyle>;
  selectionIndex: number;
  isMultiSelectable: boolean;
  onSelect: (image: LocalMediaParams) => void;
  onMultiSelect: (image: LocalMediaParams) => void;
  image: LocalMediaParams;
};

export const PhotoListItem = React.memo<PhotoListItemProps>(
  ({
    image,
    isMultiSelectable,
    selectionIndex,
    onSelect,
    styeProp,
    onMultiSelect,
  }) => {
    const onTap = useCallback(() => {
      onSelect(image);
    }, [onSelect, image]);

    const onLongPress = useCallback(() => {
      onMultiSelect(image);
    }, [onMultiSelect, image]);

    return (
      <AppPressable
        onTap={onTap}
        disableLongPress={isMultiSelectable}
        vibrateOnLongPress={true}
        onLongPress={onLongPress}
      >
        <AppContainer width={SIZE_16} height={SIZE_16} styleProp={styeProp}>
          <Image
            source={{ ...image }}
            resizeMode="cover"
            style={styles.photo}
            fadeDuration={0}
          />
          {selectionIndex >= 0 && (
            <Animated.View
              style={styles.overlay}
              entering={ZoomIn.duration(200)}
              exiting={ZoomOut.duration(200)}
            >
              {!isMultiSelectable ? (
                <AppIcon name="tick" size="small" />
              ) : (
                <AppLabel text={selectionIndex + 1 + ""} size="large" />
              )}
            </Animated.View>
          )}
        </AppContainer>
      </AppPressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.image === nextProps.image &&
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
    backgroundColor: "#e1e1e1",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
