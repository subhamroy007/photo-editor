import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { SCREEN_WIDTH } from "../constants/constants";

export interface SelectableImageGalleryItemProps {
  selectionNumber: number;
  onPress: (item: string, index: number) => void;
  onLongPress: (item: string, index: number) => void;
  uri: string;
  inLastRow: boolean;
  index: number;
}

export const SelectableImageGalleryItem =
  React.memo<SelectableImageGalleryItemProps>(
    ({ onLongPress, onPress, selectionNumber, uri, inLastRow, index }) => {
      const onPressCallback = useCallback(() => {
        onPress(uri, index);
      }, [index, onPress, uri]);

      const onLongPressCallback = useCallback(() => {
        onLongPress(uri, index);
      }, [index, onLongPress]);

      return (
        <Pressable
          onPress={onPressCallback}
          onLongPress={onLongPressCallback}
          style={{
            width: SCREEN_WIDTH / 3,
            height: SCREEN_WIDTH / 3,
            paddingBottom: inLastRow ? 0 : 1,
            paddingRight: (index + 1) % 3 === 0 ? 0 : 1,
          }}
        >
          <FastImage
            source={{ uri, priority: "high", cache: "immutable" }}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
          {selectionNumber > 0 && (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                position: "absolute",
                top: 0,
                left: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 24 }}>
                {selectionNumber}
              </Text>
            </View>
          )}
        </Pressable>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.selectionNumber === nextProps.selectionNumber &&
        prevProps.inLastRow === nextProps.inLastRow &&
        prevProps.index === nextProps.index &&
        prevProps.uri === nextProps.uri &&
        prevProps.onLongPress == nextProps.onLongPress &&
        prevProps.onPress === nextProps.onPress
      );
    }
  );
