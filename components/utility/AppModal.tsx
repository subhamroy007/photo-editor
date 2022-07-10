import { ReactNode, useCallback, useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SHUTTER_ANIMATION_DURATION_MS,
  SIZE_21,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";

export type AppModalProps = {
  isVisible: boolean;
  onDismiss: () => void;
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
  children: ReactNode;
  height: number;
};

export function AppModal({
  isVisible,
  onDismiss,
  afterClose,
  beforeClose,
  afterOpen,
  beforeOpen,
  children,
  height,
}: AppModalProps) {
  const animatedValue = useSharedValue(0);

  const [show, setShow] = useState(false);

  const reset = useCallback(() => {
    setShow(false);
    if (afterClose) {
      afterClose();
    }
  }, [afterClose]);

  const shiftShutter = useCallback(
    (open: boolean = true) => {
      animatedValue.value = withTiming(
        open ? -height : 0,
        { duration: SHUTTER_ANIMATION_DURATION_MS },
        () => {
          if (open && afterOpen) {
            runOnJS(afterOpen)();
          } else if (!open) {
            runOnJS(reset)();
          }
        }
      );
    },
    [height, reset, afterOpen]
  );

  const showHandler = useCallback(() => {
    if (beforeOpen) {
      beforeOpen();
    }
    shiftShutter(true);
  }, [shiftShutter]);

  const dismissHandler = useCallback(() => {
    if (beforeClose) {
      beforeClose();
    }
    shiftShutter(false);
  }, [beforeClose, shiftShutter]);

  useEffect(() => {
    if (isVisible && !show) {
      setShow(true);
    } else if (!isVisible && show) {
      dismissHandler();
    }
  }, [show, isVisible, dismissHandler]);

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: animatedValue.value }],
    };
  });

  return (
    <Modal
      transparent
      statusBarTranslucent
      style={[globalStyles.justifyEnd]}
      onRequestClose={onDismiss}
      onShow={showHandler}
      visible={show}
    >
      <GestureHandlerRootView
        style={[globalStyles.flex1, globalStyles.justifyEnd]}
      >
        <Pressable
          style={[
            globalStyles.semitransparentBackgroundColor,
            StyleSheet.absoluteFill,
          ]}
          onPress={onDismiss}
          android_disableSound
        />
        <Animated.View
          style={[
            globalStyles.primaryLightBackgroundColor,
            styles.modal,
            modalAnimatedStyle,
            {
              height,
              bottom: -height,
            },
          ]}
        >
          <View
            style={[
              styles.topLabelContainer,
              globalStyles.justifyCenter,
              globalStyles.alignCenter,
            ]}
          >
            <View
              style={[
                styles.topLabel,
                globalStyles.secondaryLightBackgroundColor,
              ]}
            />
          </View>
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderTopEndRadius: SIZE_6,
    borderTopStartRadius: SIZE_6,
    borderTopLeftRadius: SIZE_6,
    borderTopRightRadius: SIZE_6,
  },
  topLabel: {
    width: SIZE_21,
    height: 8 * StyleSheet.hairlineWidth,
    borderRadius: 8 * StyleSheet.hairlineWidth,
  },
  topLabelContainer: {
    height: SIZE_6,
  },
});
