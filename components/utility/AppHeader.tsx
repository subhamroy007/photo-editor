import { ReactElement } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectAppTheme } from "../../api/global/appSelector";
import { COLOR_8, HEADER_HEIGHT } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconName } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";

export type AppHeader = {
  style?: StyleProp<ViewStyle>;
  LeftNode?: () => ReactElement;
  RightNode?: () => ReactElement;
  TitleNode?: () => ReactElement;
  leftIcon?: IconName;
  rightIcon?: IconName;
  title?: string;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  transparent?: boolean;
};

export function AppHeader({
  style,
  title,
  leftIcon,
  rightIcon,
  LeftNode,
  RightNode,
  TitleNode,
  onLeftIconPress,
  onRightIconPress,
  transparent,
}: AppHeader) {
  const theme = useStoreSelector(selectAppTheme);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.headerWrapper,
        transparent
          ? undefined
          : theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
        globalStyles.absolutePosition,
        style,
      ]}
    >
      <View
        style={[
          globalStyles.flexRow,
          styles.header,
          globalStyles.paddingHorizontalSize4,
          globalStyles.alignCenter,
        ]}
      >
        {leftIcon && (
          <Pressable android_disableSound onPress={onLeftIconPress}>
            <AppIcon
              name={leftIcon}
              foreground={transparent ? COLOR_8 : undefined}
            />
          </Pressable>
        )}
        {LeftNode && (
          <View style={[globalStyles.flexRow]}>
            <LeftNode />
          </View>
        )}
        {title && (
          <AppLabel
            text={title}
            size="extra-large"
            style="bold"
            styleProp={[globalStyles.flex1, globalStyles.marginLeftSize7]}
            foreground={transparent ? COLOR_8 : undefined}
            alignment="left"
          />
        )}
        {TitleNode && (
          <View
            style={[
              globalStyles.flex1,
              globalStyles.marginLeftSize7,
              globalStyles.flexRow,
            ]}
          >
            <TitleNode />
          </View>
        )}
        {rightIcon && (
          <Pressable
            style={[
              {
                marginLeft: "auto",
              },
              globalStyles.marginLeftSize7,
            ]}
            android_disableSound
            onPress={onRightIconPress}
          >
            <AppIcon
              name={rightIcon}
              foreground={transparent ? COLOR_8 : undefined}
            />
          </Pressable>
        )}
        {RightNode && (
          <View
            style={[
              globalStyles.marginLeftSize7,
              globalStyles.flexRow,
              { marginLeft: "auto" },
            ]}
          >
            <RightNode />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
  },
  headerWrapper: {
    left: 0,
    right: 0,
    top: 0,
    width: "100%",
  },
});
