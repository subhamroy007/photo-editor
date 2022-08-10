import { Image, StyleSheet } from "react-native";
import { COLOR_5, COLOR_8, SIZE_12, SIZE_4 } from "../../constants/constants";
import { MediaParams } from "../../constants/types";

export type PosterProps = {
  image: MediaParams;
};

export function Poster({ image }: PosterProps) {
  return (
    <Image
      style={styles.poster}
      resizeMode="cover"
      source={image}
      fadeDuration={0}
    />
  );
}

const styles = StyleSheet.create({
  poster: {
    width: SIZE_12,
    height: SIZE_12,
    backgroundColor: COLOR_5,
    borderRadius: SIZE_4,
    borderColor: COLOR_8,
    borderWidth: 4 * StyleSheet.hairlineWidth,
  },
});
