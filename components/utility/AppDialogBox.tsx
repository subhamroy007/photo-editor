import { useCallback, useRef } from "react";
import {
  Animated,
  InteractionManager,
  Modal,
  Pressable,
  View,
} from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_19,
  COLOR_5,
  COLOR_7,
  MODAL_ANIMATION_DURATION_MS,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Label } from "./Label";
import { AppPressable } from "./AppPressable";

export type AppDialogBoxProps = {
  isVisible: boolean;
  onDismiss: () => void;
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
}: AppDialogBoxProps) {
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  const theme = useStoreSelector(selectAppTheme);

  const changeBoxState = useCallback((value: boolean) => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: true,
      duration: MODAL_ANIMATION_DURATION_MS,
      isInteraction: true,
    }).start();
  }, []);

  const onRequestClose = useCallback(() => {
    changeBoxState(false);
    InteractionManager.runAfterInteractions(onDismiss);
  }, [onDismiss]);

  const onShow = useCallback(() => {
    changeBoxState(true);
  }, []);

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={isVisible}
      onShow={onShow}
      onRequestClose={onRequestClose}
    >
      <Pressable
        onPress={onRequestClose}
        style={[
          globalStyles.flex1,
          globalStyles.semiTransparentBackgroundColor,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <Animated.View
          style={[
            { maxWidth: "70%", transform: [{ scale: animatedValue }] },
            theme === "light"
              ? globalStyles.primaryLightBackgroundColor
              : globalStyles.primaryDarkBackgroundColor,
            ,
            globalStyles.borderBottomRadiusSize3,
            globalStyles.borderTopRadiusSize3,
          ]}
        >
          <View
            style={[
              globalStyles.paddingVerticalSize4,
              globalStyles.paddingHorizontalSize4,
            ]}
          >
            <Label
              text={title}
              size="large"
              style="bold"
              alignment="center"
              gapVertical="large"
            />
            {info && (
              <Label
                text={info}
                foreground={theme === "dark" ? COLOR_19 : COLOR_5}
                style="regular"
                alignment="center"
                gapVertical="large"
                noOfLines={4}
              />
            )}
          </View>
          {options.map((item, index) => {
            return (
              <AppPressable
                type="underlay"
                onPress={() => {
                  onRequestClose();
                  InteractionManager.runAfterInteractions(item.onPress);
                }}
                style={[
                  globalStyles.primaryTopBorderWidth,
                  theme === "dark"
                    ? globalStyles.primaryLightBorderColor
                    : globalStyles.primaryDarkBorderColor,
                  index === options.length - 1
                    ? globalStyles.borderBottomRadiusSize3
                    : undefined,
                ]}
                key={item.label}
              >
                <Label
                  text={item.label}
                  style={index === 0 ? "medium" : "regular"}
                  size="medium"
                  gap="extra-large"
                  foreground={item.color}
                />
              </AppPressable>
            );
          })}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
