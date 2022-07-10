import { ReactElement } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HEADER_HEIGHT } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconName } from "../../constants/types";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";

export type AppHeader = {
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  LeftNode?: () => ReactElement;
  RightNode?: () => ReactElement;
  TitleNode?: () => ReactElement;
  leftIcon?: IconName;
  rightIcon?: IconName;
  title?: string;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
};

export function AppHeader({
  transparent,
  style,
  title,
  leftIcon,
  rightIcon,
  LeftNode,
  RightNode,
  TitleNode,
  onLeftIconPress,
  onRightIconPress,
}: AppHeader) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[globalStyles.absolutePosition, styles.headerContainer, style]}
    >
      <View
        style={[
          globalStyles.flexRow,
          styles.header,
          transparent ? undefined : globalStyles.primaryLightBackgroundColor,
        ]}
      >
        {leftIcon && (
          <Pressable
            style={[
              globalStyles.alignCenter,
              globalStyles.flexRow,
              globalStyles.paddingHorizontalSize4,
            ]}
            android_disableSound
            onPress={onLeftIconPress}
          >
            <AppIcon name={leftIcon} />
          </Pressable>
        )}
        {LeftNode && (
          <View
            style={[globalStyles.paddingHorizontalSize4, globalStyles.flexRow]}
          >
            <LeftNode />
          </View>
        )}
        {title && (
          <View
            style={[
              globalStyles.flex1,
              globalStyles.alignCenter,
              globalStyles.paddingHorizontalSize4,
              globalStyles.flexRow,
            ]}
          >
            <AppLabel
              text={title}
              size="large"
              style="bold"
              styleProp={{ maxWidth: "100%" }}
            />
          </View>
        )}
        {TitleNode && (
          <View
            style={[
              globalStyles.flex1,
              globalStyles.paddingHorizontalSize4,
              globalStyles.flexRow,
            ]}
          >
            <TitleNode />
          </View>
        )}
        {rightIcon && (
          <Pressable
            style={[
              globalStyles.alignCenter,
              globalStyles.flexRow,
              globalStyles.paddingHorizontalSize4,
              {
                marginLeft: "auto",
              },
            ]}
            android_disableSound
            onPress={onRightIconPress}
          >
            <AppIcon name={rightIcon} />
          </Pressable>
        )}
        {RightNode && (
          <View
            style={[
              globalStyles.paddingHorizontalSize4,
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
  headerContainer: {
    left: 0,
    right: 0,
    top: 0,
    width: "100%",
  },
  header: {
    height: HEADER_HEIGHT,
  },
});
