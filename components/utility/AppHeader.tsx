import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import { COLOR_8, HEADER_HEIGHT } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconName } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { Icon } from "./Icon";
import { Label } from "./Label";

export type AppHeader = {
  style?: StyleProp<ViewStyle>;
  leftnode?: ReactNode;
  rightnode?: ReactNode;
  titlenode?: ReactNode;
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
  leftnode,
  rightnode,
  titlenode,
  onLeftIconPress,
  onRightIconPress,
  transparent,
}: AppHeader) {
  const theme = useStoreSelector(selectAppTheme);

  return (
    <View
      style={[
        style,
        globalStyles.flexRow,
        styles.header,
        globalStyles.paddingHorizontalSize4,
        globalStyles.alignCenter,
        transparent
          ? undefined
          : theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
        transparent || theme === "dark"
          ? globalStyles.primaryDarkBorderColor
          : globalStyles.primaryLightBorderColor,
        transparent ? undefined : globalStyles.primaryBottomBorderWidth,
      ]}
    >
      {leftIcon && (
        <Pressable
          android_disableSound
          onPress={onLeftIconPress}
          style={globalStyles.marginRightSize7}
        >
          <Icon
            name={leftIcon}
            foreground={transparent ? COLOR_8 : undefined}
          />
        </Pressable>
      )}
      {leftnode && (
        <View style={[globalStyles.flexRow, globalStyles.marginRightSize7]}>
          {leftnode}
        </View>
      )}
      {title && <Label text={title} size="large" transparent={transparent} />}
      {titlenode && (
        <View style={[globalStyles.flexRow, globalStyles.alignCenter]}>
          {titlenode}
        </View>
      )}
      {rightIcon && (
        <Pressable
          style={[
            {
              marginLeft: "auto",
            },
            globalStyles.marginRightSize4,
          ]}
          android_disableSound
          onPress={onRightIconPress}
        >
          <Icon
            name={rightIcon}
            foreground={transparent ? COLOR_8 : undefined}
          />
        </Pressable>
      )}
      {rightnode && (
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignCenter,
            { marginLeft: "auto" },
          ]}
        >
          {rightnode}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
  },
});
