import { StyleProp, ViewStyle } from "react-native";
import { globalStyles } from "../../constants/style";
import { IconName } from "../../constants/types";
import { Label } from "./Label";
import { AppPressable } from "./AppPressable";
import { Icon } from "./Icon";

export type ButtonProps = {
  text: string;
  name: IconName;
  color?: string;
  transparent?: boolean;
  styleProp?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export function Button({
  name,
  onPress,
  text,
  color,
  styleProp,
  transparent,
}: ButtonProps) {
  return (
    <AppPressable
      style={[
        styleProp,
        globalStyles.paddingVerticalSize5,
        globalStyles.paddingHorizontalSize4,
        globalStyles.flexRow,
      ]}
      onPress={onPress}
      type="underlay"
    >
      <Icon
        name={name}
        transparent={transparent}
        size="small"
        foreground={color}
      />
      <Label
        text={text}
        transparent={transparent}
        size="medium"
        foreground={color}
        style="regular"
        styleProp={globalStyles.marginLeftSize4}
      />
    </AppPressable>
  );
}
