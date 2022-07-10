import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  COLOR_1,
  COLOR_8,
  IMAGE_POST_CONTENT_HEIGHT,
  SIZE_4,
  SIZE_5,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { MediaParams } from "../../constants/types";
import { AppImageList } from "../utility/AppImageList";
import { AppLabel } from "../utility/AppLabel";

export type FeedImagePostBody = {
  images: MediaParams[];
  isLoading: boolean;
  onLoad: () => void;
  onError: () => void;
  isReady: boolean;
  isVisble: boolean;
  width: number;
};

export function FeedImagePostBody(props: FeedImagePostBody) {
  const { images, isLoading, isReady, isVisble, onError, onLoad, width } =
    props;

  const [imageIndex, setImageIndex] = useState(0);

  const imageIndexChangeHandler = useCallback((offset: number) => {
    setImageIndex(Math.round(offset / width));
  }, []);

  useEffect(() => {
    if (isLoading) {
      const prepare = async () => {
        try {
          await Promise.all(images.map((image) => Image.prefetch(image.uri)));
          onLoad();
        } catch (error: any) {
          onError();
        }
      };

      prepare();
    }
  }, [isLoading]);

  return (
    <>
      {isReady && (
        <>
          <AppImageList
            images={images}
            onImageIndexChange={imageIndexChangeHandler}
            height={IMAGE_POST_CONTENT_HEIGHT}
            imageIndex={0}
            width={width}
          />
          {images.length > 1 && (
            <>
              <AppLabel
                text={imageIndex + 1 + "/" + images.length}
                styleProp={[
                  globalStyles.absolutePosition,
                  styles.countLabel,
                  globalStyles.alignSelfCenter,
                ]}
                style="regular"
                foreground={COLOR_8}
              />
              <View
                style={[
                  globalStyles.absolutePosition,
                  globalStyles.alignSelfCenter,
                  {
                    width: (images.length * 2 + 1) * SIZE_4,
                  },
                  globalStyles.alignCenter,
                  globalStyles.justifyEven,
                  globalStyles.flexRow,
                  styles.carosol,
                ]}
              >
                {images.map((item, currIndex) => (
                  <View
                    key={item.uri}
                    style={{
                      width: SIZE_4,
                      height: SIZE_4,
                      borderRadius: SIZE_4 / 2,
                      backgroundColor:
                        currIndex === imageIndex ? COLOR_1 : COLOR_8,
                    }}
                  />
                ))}
              </View>
            </>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  countLabel: {
    top: SIZE_5,
  },
  carosol: {
    bottom: SIZE_5,
    height: SIZE_6,
  },
});
