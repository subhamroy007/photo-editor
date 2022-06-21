import { useCallback } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { SIZE_18, SIZE_20, SIZE_4, SIZE_5 } from "../../constants/constants";
import { ContentType } from "../../constants/types";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";

export type SwitchContentTypeModalProps = {
  onSwitch: (value: ContentType) => void;
};

export function SwitchContentTypeModal({
  onSwitch,
}: SwitchContentTypeModalProps) {
  const onPhotoSelect = useCallback(() => {
    onSwitch("PHOTO");
  }, [onSwitch]);

  const onVideoSelect = useCallback(() => {
    onSwitch("VIDEO");
  }, [onSwitch]);

  const onStorySelect = useCallback(() => {
    onSwitch("STORY");
  }, [onSwitch]);

  const onShortsSelect = useCallback(() => {
    onSwitch("SHORTS");
  }, [onSwitch]);
  return (
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(200)}
      exiting={FadeOutDown.duration(200)}
    >
      <AppPressable
        disableLongPress={true}
        overlayColor="white"
        styleProp={[styles.topItem, styles.item]}
        onTap={onPhotoSelect}
      >
        <AppIcon name="landscape" size="extra-small" />
        <AppLabel text="PHOTO" size="small" />
      </AppPressable>
      <AppPressable
        disableLongPress={true}
        overlayColor="white"
        styleProp={styles.item}
        onTap={onVideoSelect}
      >
        <AppIcon name="video" size="extra-small" />
        <AppLabel text="VIDEO" size="small" />
      </AppPressable>
      <AppPressable
        disableLongPress={true}
        overlayColor="white"
        styleProp={styles.item}
        onTap={onStorySelect}
      >
        <AppIcon name="story" size="extra-small" />
        <AppLabel text="STORY" size="small" />
      </AppPressable>
      <AppPressable
        disableLongPress={true}
        overlayColor="white"
        styleProp={[styles.bottomItem, styles.item]}
        onTap={onShortsSelect}
      >
        <AppIcon name="shorts" size="extra-small" />
        <AppLabel text="SHORTS" size="small" />
      </AppPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: SIZE_20,
    borderRadius: SIZE_4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  item: {
    padding: SIZE_5,
    width: SIZE_18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topItem: {
    borderTopStartRadius: SIZE_4,
    borderTopEndRadius: SIZE_4,
  },
  bottomItem: {
    borderBottomStartRadius: SIZE_4,
    borderBottomEndRadius: SIZE_4,
  },
});
