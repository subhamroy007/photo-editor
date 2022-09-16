import { useLayout } from "@react-native-community/hooks";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { Animated, InteractionManager, Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectAppTheme } from "../../api/global/appSelector";
import { MODAL_ANIMATION_DURATION_MS } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Label } from "./Label";

export const AnimatedSafeAreaView =
  Animated.createAnimatedComponent(SafeAreaView);

export type AppShutterProps = {
  title: string;
  children: ReactNode;
  isVisible: boolean;
  onDismiss: () => void;
  transparent?: boolean;
};

export function AppShutter({
  children,
  isVisible,
  onDismiss,
  title,
  transparent,
}: AppShutterProps) {
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  const theme = useStoreSelector(selectAppTheme);

  const { height, onLayout } = useLayout();

  const shiftShutter = useCallback((value: number) => {
    Animated.timing(animatedValue, {
      toValue: value,
      useNativeDriver: true,
      isInteraction: true,
      duration: MODAL_ANIMATION_DURATION_MS,
    }).start();
  }, []);

  const onRequestClose = useCallback(() => {
    shiftShutter(0);
    InteractionManager.runAfterInteractions(onDismiss);
  }, [onDismiss]);

  useEffect(() => {
    if (isVisible && height > 0) {
      shiftShutter(-height);
    }
  }, [isVisible, height]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <AnimatedSafeAreaView
        edges={["top", "left", "bottom", "right"]}
        style={[
          globalStyles.flex1,
          transparent
            ? globalStyles.semiTransparentBackgroundColor
            : theme === "light"
            ? globalStyles.primaryLightBackgroundColor
            : globalStyles.primaryDarkBackgroundColor,
          { top: "100%", transform: [{ translateY: animatedValue }] },
        ]}
        onLayout={onLayout}
      >
        <View
          style={[
            globalStyles.alignCenter,
            globalStyles.justifyCenter,
            globalStyles.paddingVerticalSize4,
            globalStyles.paddingHorizontalSize4,
            globalStyles.primaryBottomBorderWidth,
            transparent || theme === "dark"
              ? globalStyles.primaryLightBorderColor
              : globalStyles.primaryDarkBorderColor,
          ]}
        >
          <Label
            text={title}
            size="medium"
            style="bold"
            transparent={transparent}
          />
        </View>
        {children}
      </AnimatedSafeAreaView>
    </Modal>
  );
}
