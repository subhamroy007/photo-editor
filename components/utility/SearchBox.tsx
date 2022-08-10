import { useKeyboard } from "@react-native-community/hooks";
import { useEffect, useRef } from "react";
import { Pressable, StyleProp, TextInput, View, ViewStyle } from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_19,
  COLOR_5,
  COLOR_7,
  COLOR_8,
  SIZE_10,
  SIZE_5,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppIcon } from "./AppIcon";

export type SearchBoxProps = {
  textContent: string;
  onTextContentChange: (value: string) => void;
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SearchBox({
  onTextContentChange,
  textContent,
  transparent,
  style,
}: SearchBoxProps) {
  const theme = useStoreSelector(selectAppTheme);

  const { keyboardShown } = useKeyboard();

  const inputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    if (!keyboardShown && inputRef.current) {
      inputRef.current.blur();
    }
  }, [keyboardShown]);

  return (
    <View
      style={[
        globalStyles.paddingVerticalSize2,
        globalStyles.paddingHorizontalSize4,
        globalStyles.flexRow,
        globalStyles.alignCenter,
        globalStyles.secondaryBottomBorderWidth,
        transparent || theme === "dark"
          ? globalStyles.primaryLightBorderColor
          : globalStyles.primaryDarkBorderColor,
        style,
      ]}
    >
      <AppIcon
        name="search-bold"
        size="small"
        transparent={transparent}
        type="info"
      />
      <TextInput
        ref={inputRef}
        placeholder="Search Account..."
        value={textContent}
        style={[
          {
            fontSize: SIZE_10,
            color: transparent || theme === "dark" ? COLOR_8 : COLOR_7,
          },
          globalStyles.marginLeftSize4,
          globalStyles.flex1,
        ]}
        placeholderTextColor={
          transparent || theme === "dark" ? COLOR_19 : COLOR_5
        }
        onChangeText={onTextContentChange}
      />
      {textContent !== "" && (
        <Pressable
          android_disableSound
          hitSlop={SIZE_5}
          style={globalStyles.marginLeftSize4}
          onPress={() => onTextContentChange("")}
        >
          <AppIcon name="close" size="extra-small" transparent={transparent} />
        </Pressable>
      )}
    </View>
  );
}
