import { useLayout } from "@react-native-community/hooks";
import { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  InteractionManager,
  Modal,
  PanResponder,
  ScrollView,
  View,
} from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_19,
  COLOR_5,
  COLOR_7,
  COLOR_8,
  MODAL_ANIMATION_DURATION_MS,
  SCREEN_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconName } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";
import { AppPressable } from "./AppPressable";

export type AppModalProps = {
  grids?: {
    list: {
      name: IconName;
      color?: string;
      onPress: () => void;
      label: string;
    }[];
    size: "medium" | "large";
  };
  rows?: {
    color?: string;
    icon?: IconName;
    text: string;
    onPress: () => void;
  }[];
  items?: {
    title?: string;
    info?: string;
    list: string[];
    onPress: (item: string) => void;
  };
  isVisible: boolean;
  onDismiss: () => void;
};

export function AppModal({
  rows,
  grids,
  isVisible,
  items,
  onDismiss,
}: AppModalProps) {
  const { height, onLayout } = useLayout();

  const theme = useStoreSelector(selectAppTheme);

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
          onRequestClose();
        } else if (gestureState.vy >= 2) {
          onRequestClose();
        } else if (gestureState.vy <= -2) {
          shiftModal(minValue.current);
        } else {
          if (lastOffsetValue < minValue.current / 2) {
            shiftModal(minValue.current);
          } else {
            onRequestClose();
          }
        }
      },
    })
  ).current;

  const onRequestClose = useCallback(() => {
    shiftModal(0);
    InteractionManager.runAfterInteractions(onDismiss);
  }, [onDismiss]);

  const shiftModal = useCallback((value: number) => {
    Animated.timing(animatedValue, {
      toValue: value,
      useNativeDriver: true,
      duration: MODAL_ANIMATION_DURATION_MS,
      isInteraction: true,
    }).start((finished) => {
      if (finished) {
        offset.current = value;
      }
    });
  }, []);

  useEffect(() => {
    minValue.current = -height;
    if (height > 0 && isVisible) {
      shiftModal(-height);
    }
  }, [height, isVisible]);

  const pressHandler = useCallback(
    (index: number, type: "icon" | "button" | "item") => {
      onRequestClose();
      switch (type) {
        case "button":
          InteractionManager.runAfterInteractions(rows![index].onPress);
          break;
        case "item":
          InteractionManager.runAfterInteractions(() => {
            items?.onPress(items.list[index]);
          });
          break;
        case "icon":
          InteractionManager.runAfterInteractions(grids?.list[index].onPress);
          break;
      }
    },
    [grids, rows, items]
  );

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onRequestClose}
      transparent
      statusBarTranslucent
    >
      <View
        style={[
          globalStyles.flex1,
          globalStyles.semiTransparentBackgroundColor2,
        ]}
        {...panResponder.panHandlers}
      ></View>
      <Animated.View
        onLayout={onLayout}
        style={[
          theme === "light"
            ? globalStyles.primaryLightBackgroundColor
            : globalStyles.primaryDarkBackgroundColor,
          globalStyles.borderTopRadiusSize3,
          globalStyles.absolutePosition,
          {
            maxHeight: SCREEN_HEIGHT * 0.8,
            top: "100%",
            width: "100%",
            transform: [
              {
                translateY: animatedValue,
              },
            ],
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          contentContainerStyle={globalStyles.paddingVerticalSize4}
        >
          {grids && (
            <View
              style={[
                globalStyles.flexRow,
                globalStyles.flexWrap,
                globalStyles.primaryBottomBorderWidth,
                theme === "dark"
                  ? globalStyles.primaryLightBorderColor
                  : globalStyles.primaryDarkBorderColor,
                globalStyles.paddingVerticalSize4,
                globalStyles.justifyAround,
              ]}
            >
              {grids.list.map((item, index) => {
                return (
                  <AppPressable
                    type="animated"
                    onPress={() => {
                      pressHandler(index, "icon");
                    }}
                    key={item.label}
                    style={[
                      { width: grids.size === "medium" ? "25%" : "33.33%" },
                      globalStyles.alignCenter,
                      globalStyles.justifyCenter,
                      globalStyles.paddingVerticalSize4,
                    ]}
                  >
                    <AppIcon
                      name={item.name}
                      gap={grids.size}
                      borderVisible
                      foreground={item.color}
                    />
                    <AppLabel
                      text={item.label}
                      foreground={item.color}
                      styleProp={globalStyles.marginTopSize2}
                    />
                  </AppPressable>
                );
              })}
            </View>
          )}
          {rows && (
            <>
              {rows.map((item, index) => {
                return (
                  <AppPressable
                    key={item.text}
                    style={[
                      globalStyles.flexRow,
                      globalStyles.paddingHorizontalSize4,
                      globalStyles.paddingVerticalSize4,
                    ]}
                    onPress={() => {
                      pressHandler(index, "button");
                    }}
                    type="underlay"
                  >
                    {item.icon && (
                      <AppIcon
                        name={item.icon}
                        size="small"
                        styleProp={globalStyles.marginRightSize2}
                        foreground={item.color}
                      />
                    )}
                    <AppLabel
                      text={item.text}
                      size="medium"
                      style="regular"
                      foreground={item.color}
                    />
                  </AppPressable>
                );
              })}
            </>
          )}
          {items && (
            <>
              {items.title && (
                <AppLabel
                  text={items.title}
                  style="medium"
                  size="medium"
                  alignment="left"
                  gap="large"
                />
              )}
              {items.info && (
                <AppLabel
                  style="regular"
                  text={items.info}
                  foreground={theme === "dark" ? COLOR_19 : COLOR_5}
                  noOfLines={4}
                  alignment="center"
                  gapHorizontal="large"
                  gapVertical="extra-small"
                />
              )}
              {items.list.map((item, index) => {
                return (
                  <AppPressable
                    key={item}
                    onPress={() => pressHandler(index, "item")}
                    type="underlay"
                  >
                    <AppLabel
                      text={item}
                      alignment="left"
                      gap="large"
                      style="regular"
                      size="medium"
                    />
                  </AppPressable>
                );
              })}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
