import React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SIZE_1, SIZE_5 } from "../../constants/constants";
import { LocalMediaParams } from "../../constants/types";
import { AppContainer } from "./AppContainer";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";
import { AppPressable } from "./AppPressable";

export type LocalMediaListItemProps = {
  media: LocalMediaParams;
  selectionIndex: number;
  disableLongPress: boolean;
  onTap: (index: number) => void;
  onLongPress?: (index: number) => void;
  multiselectable: boolean;
  index: number;
};

export const LocalMediaListItem = React.memo<LocalMediaListItemProps>(
  (props) => {
    const {
      disableLongPress,
      media,
      onTap,
      selectionIndex,
      onLongPress,
      multiselectable,
      index,
    } = props;

    return (
      <AppPressable
        onTap={() => {
          onTap(index);
        }}
        onLongPress={() => {
          if (onLongPress) {
            onLongPress(index);
          }
        }}
        disableLongPress={multiselectable || disableLongPress}
        vibrateOnLongPress={true}
      >
        <AppContainer
          width={SIZE_1}
          height={SIZE_1}
          styleProp={{
            paddingVertical: 2 * StyleSheet.hairlineWidth,
            paddingLeft: index % 3 !== 0 ? 2 * StyleSheet.hairlineWidth : 0,
            paddingRight: index % 3 !== 2 ? 2 * StyleSheet.hairlineWidth : 0,
          }}
        >
          <Image
            source={
              media.duration === 0 ? { ...media } : { ...media.thumbnail }
            }
            resizeMode="cover"
            style={styles.image}
            fadeDuration={0}
          />
          {media.duration !== 0 && (
            <AppLabel
              text={media.duration + ""}
              type="solid"
              background="black"
              foreground="white"
              corner="small-round"
              size="small"
              style="bold"
              styleProp={styles.durationLabel}
            />
          )}
          {selectionIndex >= 0 && (
            <Animated.View
              style={styles.overlay}
              entering={ZoomIn.duration(200)}
              exiting={ZoomOut.duration(200)}
            >
              {!multiselectable ? (
                <AppIcon name="tick" size="small" />
              ) : (
                <AppLabel text={selectionIndex + 1 + ""} size="medium" />
              )}
            </Animated.View>
          )}
        </AppContainer>
      </AppPressable>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.selectionIndex === nextProps.selectionIndex &&
      prevProps.onLongPress === nextProps.onLongPress &&
      prevProps.onTap === nextProps.onTap &&
      prevProps.multiselectable === nextProps.multiselectable &&
      prevProps.index === nextProps.index
    );
  }
);

const styles = StyleSheet.create({
  image: {
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
  durationLabel: { position: "absolute", bottom: SIZE_5, right: SIZE_5 },
});
