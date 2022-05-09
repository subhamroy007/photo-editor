import React from "react";
import {
  brightness,
  ColorMatrix,
  concatColorMatrices,
  contrast,
  vintage,
} from "react-native-color-matrix-image-filters";
import FastImage from "react-native-fast-image";
import { SIZE_1 } from "../../constants/constants";

export type FilteredPhotoListItemProps = {
  uri: string;
};

export const FilteredPhotoListItem = React.memo<FilteredPhotoListItemProps>(
  ({ uri }) => {
    return (
      <ColorMatrix matrix={concatColorMatrices([vintage()])}>
        <FastImage
          source={{ cache: "immutable", priority: "high", uri }}
          resizeMode="cover"
          style={{
            width: SIZE_1,
            height: SIZE_1,
          }}
        />
      </ColorMatrix>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.uri === nextProps.uri;
  }
);
