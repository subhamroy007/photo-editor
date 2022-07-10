import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  COLOR_13,
  SHUTTER_ANIMATION_DURATION_MS,
  SIZE_5,
  SIZE_6,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { AppLabel } from "./AppLabel";

export type AppDialogBoxProps = {
  isVisible: boolean;
  onDismiss: () => void;
  beforeOpen?: () => void;
  afterOpen?: () => void;
  beforeClose?: () => void;
  afterClose?: () => void;
  title: string;
  options: {
    label: string;
    color?: string;
    onPress: () => void;
  }[];
  info?: string;
};

export function AppDialogBox({
  isVisible,
  options,
  title,
  info,
  onDismiss,
  afterClose,
  afterOpen,
  beforeClose,
  beforeOpen,
}: AppDialogBoxProps) {
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
        open ? 1 : 0,
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
    [reset, afterOpen]
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

  const animatedDialogBoxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: animatedValue.value,
        },
      ],
    };
  });

  return (
    <Modal
      transparent
      statusBarTranslucent
      onRequestClose={onDismiss}
      onShow={showHandler}
      visible={show}
      animationType="fade"
    >
      <View
        style={[
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
          globalStyles.flex1,
        ]}
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
            styles.borderRadius,
            styles.dialogBox,
            animatedDialogBoxStyle,
            globalStyles.primaryLightBackgroundColor,
          ]}
        >
          <View>
            <AppLabel
              text={title}
              size="large"
              style="bold"
              noOfLines={4}
              alignment="center"
              gap="large"
            />
            {info && (
              <AppLabel
                text={info}
                style="regular"
                alignment="center"
                gap="large"
                noOfLines={4}
              />
            )}
          </View>

          {options.map((option, index) => {
            return (
              <TouchableHighlight
                key={option.label}
                onPress={option.onPress}
                style={[
                  globalStyles.defaultTopBorderWidth,
                  globalStyles.primaryDarkBorderColor,
                  {
                    borderBottomEndRadius:
                      index === options.length - 1 ? SIZE_5 : 0,
                    borderBottomStartRadius:
                      index === options.length - 1 ? SIZE_5 : 0,
                  },
                ]}
                underlayColor={COLOR_13}
                activeOpacity={1.0}
              >
                <AppLabel
                  size="medium"
                  style={index === 0 ? "medium" : "regular"}
                  text={option.label}
                  gap="large"
                  foreground={option.color ? option.color : undefined}
                />
              </TouchableHighlight>
            );
          })}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  borderRadius: {
    borderRadius: SIZE_6,
  },
  dialogBox: {
    maxWidth: "75%",
  },
});
