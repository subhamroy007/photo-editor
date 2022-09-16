import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  InteractionManager,
  LayoutChangeEvent,
  Modal as NativeModal,
  PanResponder,
} from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  MODAL_ANIMATION_DURATION_MS,
  SIZE_35,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useInteraction } from "../../hooks/useInteraction";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Label } from "./Label";

export type ModalProps = {
  isVisible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  title: string;
};

export function Modal({ isVisible, onDismiss, children, title }: ModalProps) {
  const [isOpen, setOpen] = useState(false);

  const theme = useStoreSelector(selectAppTheme);

  const { clearInteraction } = useInteraction();

  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;

  const offset = useRef(0);
  const minValue = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        animatedValue.setValue(
          Math.max(
            minValue.current,
            Math.min(0, offset.current + gestureState.dy)
          )
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const lastOffsetValue = offset.current + gestureState.dy;
        if (gestureState.dy === 0 && gestureState.vy === 0) {
          onDismiss();
        } else if (gestureState.vy >= 2) {
          onDismiss();
        } else if (gestureState.vy <= -2) {
          shiftModal(true);
        } else {
          if (lastOffsetValue < minValue.current / 2) {
            shiftModal(true);
          } else {
            onDismiss();
          }
        }
      },
    })
  ).current;

  const onRequestClose = useCallback(() => {
    shiftModal(false);
    InteractionManager.runAfterInteractions(() => setOpen(false));
  }, []);

  const shiftModal = useCallback((value: boolean) => {
    Animated.timing(animatedValue, {
      toValue: value ? minValue.current : 0,
      useNativeDriver: true,
      duration: MODAL_ANIMATION_DURATION_MS,
      isInteraction: true,
    }).start((finished) => {
      if (finished) {
        offset.current = value ? minValue.current : 0;
        clearInteraction();
      }
    });
  }, []);

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      minValue.current = -height;
      shiftModal(true);
    },
    []
  );

  useEffect(() => {
    if (isVisible) {
      setOpen(true);
    } else {
      onRequestClose();
    }
  }, [isVisible]);

  return (
    <NativeModal
      visible={isOpen}
      onRequestClose={onDismiss}
      transparent
      statusBarTranslucent
    >
      <Animated.View
        style={[
          globalStyles.flex1,
          globalStyles.semiTransparentBackgroundColor,
        ]}
        {...panResponder.panHandlers}
      />
      <Animated.View
        onLayout={onLayout}
        style={[
          theme === "light"
            ? globalStyles.primaryLightBackgroundColor
            : globalStyles.primaryDarkBackgroundColor,
          globalStyles.borderTopRadiusSize3,
          globalStyles.absolutePosition,
          {
            top: "100%",
            width: "100%",
            maxHeight: SIZE_35,
            transform: [
              {
                translateY: animatedValue,
              },
            ],
          },
        ]}
      >
        <Label
          text={title}
          size="medium"
          gap="extra-large"
          styleProp={[
            theme === "dark"
              ? globalStyles.primaryDarkBorderColor
              : globalStyles.primaryLightBorderColor,
            globalStyles.primaryBottomBorderWidth,
          ]}
        />
        {children}
      </Animated.View>
    </NativeModal>
  );
}
