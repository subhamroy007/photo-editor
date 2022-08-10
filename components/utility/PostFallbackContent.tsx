import { Image, Pressable, StyleSheet, View } from "react-native";
import { COLOR_8, SIZE_34, SIZE_9 } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { AppIcon } from "./AppIcon";

export type PostFallbackContentProps = {
  cover: string;
  onRetry: () => void;
  isError: boolean;
};

export function PostFallbackContent({
  cover,
  isError,
  onRetry,
}: PostFallbackContentProps) {
  return (
    <>
      <Image
        source={{ uri: cover }}
        style={[styles.image, globalStyles.absolutePosition]}
        resizeMode="cover"
        blurRadius={10}
        fadeDuration={0}
      />
      <View
        style={[
          globalStyles.absolutePosition,
          globalStyles.alignSelfCenter,
          styles.indicator,
        ]}
      />
      {isError && (
        <Pressable
          onPress={onRetry}
          hitSlop={SIZE_9}
          style={[globalStyles.absolutePosition, globalStyles.alignSelfCenter]}
        >
          <AppIcon name="undo" transparent size="large" />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: "100%" },
  indicator: {
    borderWidth: 2 * StyleSheet.hairlineWidth,
    width: SIZE_34,
    height: SIZE_34,
    borderRadius: Math.round(SIZE_34 / 2),
    borderColor: COLOR_8,
  },
});
