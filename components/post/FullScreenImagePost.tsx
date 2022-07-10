import React, { useCallback, useState } from "react";
import { Image } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { FullScreenImagePostProps } from "../../constants/types";
import { AppImageList } from "../utility/AppImageList";
import { AppLabel } from "../utility/AppLabel";
import { FullScreenPostTemplate } from "./FullScreenPostTemplate";

export const FullScreenImagePost = React.memo<FullScreenImagePostProps>(
  ({ height, width, initialIndex, ...restProps }) => {
    const {
      post: { media },
      notify,
      isVisible,
    } = restProps;

    const [index, setIndex] = useState(initialIndex);

    const [scrollEnabled, setScrollEnabled] = useState(true);

    const [hideDetails, setHideDetails] = useState(false);

    const [isReady, setReady] = useState(false);

    const mediaLoadHandler = useCallback(() => {
      setReady(true);
    }, []);

    const loadMedia = useCallback(async () => {
      await Promise.all(media.map((image) => Image.prefetch(image.uri)));
    }, []);

    const indexChangeHandler = useCallback((index: number) => {
      setIndex(index);
    }, []);

    const pinchStartHandler = useCallback((scale: number) => {
      setHideDetails(true);
      setScrollEnabled(false);
    }, []);

    const pinchEndHandler = useCallback((scale: number) => {
      if (scale === 1) {
        setHideDetails(false);
        setScrollEnabled(true);
      }
    }, []);

    const singleTapHandler = useCallback(() => {
      setScrollEnabled(true);
      setHideDetails((prevState) => !prevState);
    }, []);

    const {
      animatedStyle: animatedScaleStyle,
      dragGesture,
      pinchGesture,
      tapGesture,
    } = usePinchToZoomGesture(
      width,
      height,
      pinchStartHandler,
      pinchEndHandler,
      singleTapHandler,
      isReady && isVisible
    );

    const compositeGesture = Gesture.Exclusive(
      Gesture.Simultaneous(pinchGesture, dragGesture),
      tapGesture
    );

    return (
      <FullScreenPostTemplate
        externalGesture={compositeGesture}
        height={height}
        hideDetails={hideDetails}
        isReady={isReady}
        loadMedia={loadMedia}
        onLoad={mediaLoadHandler}
        width={width}
        topNode={
          media.length > 1 && <AppLabel text={index + 1 + "/" + media.length} />
        }
        {...restProps}
      >
        <AppImageList
          scrollEnabled={scrollEnabled}
          intialIndex={initialIndex}
          media={media}
          onIndexChange={indexChangeHandler}
          height={height}
          width={width}
          style={animatedScaleStyle}
        />
      </FullScreenPostTemplate>
    );
  },
  () => {
    return false;
  }
);
