import React, { ReactElement, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { COLOR_15, COLOR_7 } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountShortResponse } from "../../../constants/types";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppLabel } from "../../utility/AppLabel";
import { Tappable } from "../../utility/Tappable";

export type AccountListItemProps = {
  account: AccountShortResponse;
  disabled?: boolean;
  onTap?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  LeftNode?: () => ReactElement;
};

export const AccountListItem = React.memo<AccountListItemProps>(
  (props) => {
    const {
      account: { hasUnseenStory, profilePictureUri, userId, username },
      LeftNode,
      disabled,
      onDoubleTap,
      onLongPress,
      onTap,
    } = props;

    const tapHandler = useCallback(() => {
      if (onTap) {
        onTap();
      }
    }, [onTap]);

    const doubleTapHandler = useCallback(() => {
      if (onDoubleTap) {
        onDoubleTap();
      }
    }, [onDoubleTap]);

    const longPressHandler = useCallback(() => {
      if (onLongPress) {
        onLongPress();
      }
    }, [onLongPress]);

    const tapGesture = Gesture.Tap()
      .enabled(disabled === true ? false : true)
      .onStart(tapHandler)
      .maxDuration(400);

    const doubleTapGesture = Gesture.Tap()
      .enabled(disabled === true ? false : true)
      .onStart(doubleTapHandler)
      .numberOfTaps(2);

    const longPressGesture = Gesture.LongPress()
      .enabled(disabled === true ? false : true)
      .onStart(longPressHandler)
      .minDuration(400);

    const compositeGesture = Gesture.Exclusive(
      doubleTapGesture,
      tapGesture,
      longPressGesture
    );

    return (
      <GestureDetector gesture={compositeGesture}>
        <Animated.View
          style={[globalStyles.justifyBetween, globalStyles.flexRow]}
        >
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignCenter,
              globalStyles.paddingHorizontalSize4,
              globalStyles.paddingVerticalSize2,
              globalStyles.flex2,
            ]}
          >
            <Tappable disabled={disabled} onTap={onLongPress}>
              <AppAvatar
                uri={profilePictureUri}
                hasRing={hasUnseenStory && disabled !== true}
                isActive={hasUnseenStory}
                size="large"
              />
            </Tappable>
            <View
              style={[
                globalStyles.marginLeftSize4,
                globalStyles.alignStart,
                globalStyles.flex1,
              ]}
            >
              <AppLabel
                text={userId}
                foreground={COLOR_7}
                styleProp={styles.label}
              />
              <AppLabel
                text={username}
                foreground={COLOR_15}
                styleProp={[globalStyles.marginTopSize2, styles.label]}
              />
            </View>
          </View>

          {LeftNode && (
            <View
              style={[
                globalStyles.flexRow,
                globalStyles.alignCenter,
                globalStyles.paddingHorizontalSize4,
                globalStyles.paddingVerticalSize4,
                globalStyles.flex1,
              ]}
            >
              <LeftNode />
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    );
  },
  () => {
    return false;
  }
);

const styles = StyleSheet.create({
  label: {
    maxWidth: "100%",
  },
});
