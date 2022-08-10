import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Layout } from "react-native-reanimated";
import { LONG_PRESS_DURATION_MS, SIZE_34 } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountShortResponse } from "../../../constants/types";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppLabel } from "../../utility/AppLabel";

export type StoryListItemProps = {
  account: AccountShortResponse;
  isStoryLoading: boolean;
  onTap: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
};

export const StoryListItem = React.memo<StoryListItemProps>(
  (props) => {
    const { account, isStoryLoading, onDoubleTap, onLongPress, onTap } = props;

    const tapGesture = Gesture.Tap()
      .onStart(onTap)
      .maxDuration(LONG_PRESS_DURATION_MS);

    const longPressGesture = Gesture.LongPress()
      .onStart(onLongPress)
      .minDuration(LONG_PRESS_DURATION_MS);

    const doubleTapGesture = Gesture.Tap().numberOfTaps(2).onStart(onDoubleTap);

    const compositeGesture = Gesture.Exclusive(
      doubleTapGesture,
      tapGesture,
      longPressGesture
    );

    return (
      <GestureDetector gesture={compositeGesture}>
        <Animated.View
          style={[
            globalStyles.alignCenter,
            globalStyles.paddingHorizontalSize2,
            globalStyles.paddingVerticalSize2,
          ]}
          layout={Layout}
        >
          <AppAvatar
            uri={account.profilePictureUri}
            size="extra-large"
            hasRing
            isActive={account.hasUnseenStory}
            isAnimated={isStoryLoading}
          />
          <AppLabel
            text={account.userid}
            style="regular"
            size="extra-small"
            styleProp={[{ maxWidth: SIZE_34 }, globalStyles.marginTopSize2]}
          />
        </Animated.View>
      </GestureDetector>
    );
  },
  (prevProps, nextProps) => {
    return false;
  }
);
