import React, { useCallback, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import {
  COLOR_1,
  COLOR_8,
  IMAGE_POST_CONTENT_HEIGHT,
  SIZE_4,
  SIZE_5,
  SIZE_6,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { FeedPostProps } from "../../constants/types";
import { AppImageList } from "../utility/AppImageList";
import { AppLabel } from "../utility/AppLabel";
import { FeedPostTemplate } from "./FeedPostTemplate";

export const FeedImagePost = React.memo<FeedPostProps>(
  (props) => {
    const {
      post: { media },
      width,
      isVisible,
    } = props;

    const [isReady, setReady] = useState(false);

    const [photoIndex, setPhotoIndex] = useState(0);

    const loadHanlder = useCallback(() => {
      setReady(true);
    }, []);

    const loadAsync = useCallback(async () => {
      await Promise.all(media.map((image) => Image.prefetch(image.uri)));
    }, []);

    const photoIndexChangeHandler = useCallback((newIndex) => {
      setPhotoIndex(newIndex);
    }, []);

    return (
      <FeedPostTemplate
        {...props}
        onLoad={loadHanlder}
        height={IMAGE_POST_CONTENT_HEIGHT}
        loadAsync={loadAsync}
      >
        {isReady && (
          <>
            <AppImageList
              height={IMAGE_POST_CONTENT_HEIGHT}
              width={width}
              media={media}
              disableZoom
              disabled={!isVisible}
              onIndexChange={photoIndexChangeHandler}
            />
            {media.length > 1 && (
              <>
                <AppLabel
                  text={photoIndex + 1 + "/" + media.length}
                  styleProp={[globalStyles.absolutePosition, styles.countLabel]}
                  style="regular"
                />
                <View
                  style={[
                    globalStyles.absolutePosition,
                    {
                      width: (media.length * 2 + 1) * 6,
                    },
                    globalStyles.alignCenter,
                    globalStyles.justifyEven,
                    globalStyles.flexRow,
                    styles.carosol,
                  ]}
                >
                  {media.map((item, currIndex) => (
                    <View
                      key={item.uri}
                      style={{
                        width: SIZE_4,
                        height: SIZE_4,
                        borderRadius: SIZE_4 / 2,
                        backgroundColor:
                          currIndex === photoIndex ? COLOR_1 : COLOR_8,
                      }}
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </FeedPostTemplate>
    );
  },
  () => {
    return false;
  }
);

const styles = StyleSheet.create({
  countLabel: {
    top: SIZE_5,
  },
  carosol: {
    bottom: SIZE_5,
    height: SIZE_6,
  },
});
