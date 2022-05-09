import React from "react";
import { Animated, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/constants";
import { MediaParams } from "../../constants/types";
import { AppPhoto } from "../utility/AppPhoto";

export type PreviewPhotoListItemProps = {
  animatedTranslation: Animated.AnimatedInterpolation;
} & MediaParams;

export const PreviewPhotoListItem = React.memo<PreviewPhotoListItemProps>(
  ({ height, uri, width, animatedTranslation, duration }) => {
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: animatedTranslation }] },
        ]}
      >
        <AppPhoto
          boxHeight={SCREEN_HEIGHT}
          boxWidth={SCREEN_WIDTH}
          media={{ width, height, uri, duration }}
          style="dynamic"
        />
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.height === nextProps.height &&
      prevProps.uri === nextProps.uri &&
      prevProps.width === nextProps.width
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});
