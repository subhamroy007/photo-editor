import { Image, Pressable, StyleSheet, View } from "react-native";
import { COLOR_7, COLOR_8, SIZE_34 } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { RoundIcon } from "./RoundIcon";

export type MediaLoadingIndicatorProps = {
  cover: string;
  onRetry: () => void;
  isError: boolean;
};

export function MediaLoadingIndicator({
  cover,
  isError,
  onRetry,
}: MediaLoadingIndicatorProps) {
  return (
    <>
      <Image
        source={{ uri: cover }}
        style={[styles.image, globalStyles.absolutePosition]}
        resizeMode="cover"
        blurRadius={10}
        fadeDuration={0}
      />

      {isError ? (
        <Pressable
          onPress={onRetry}
          style={[globalStyles.absolutePosition, globalStyles.alignSelfCenter]}
        >
          <RoundIcon
            name="retry"
            transparent
            background={COLOR_7}
            gap="large"
            size="large"
          />
        </Pressable>
      ) : (
        <View
          style={[
            globalStyles.absolutePosition,
            globalStyles.alignSelfCenter,
            styles.indicator,
          ]}
        />
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
