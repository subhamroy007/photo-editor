import { useRef } from "react";
import { StyleProp, StyleSheet, TextInput, ViewStyle } from "react-native";
import { SIZE_3, SIZE_4 } from "../../constants/constants";
import { AppContainer } from "./AppContainer";

export type AppTextInputProps = {
  multiline?: boolean;
  placeholder?: string;
  maxHeight?: number;
  styleProp?: StyleProp<ViewStyle>;
  style?: "solid" | "outline";
  onTextChange: (text: string) => void;
  text: string;
};

export function AppTextInput({
  multiline,
  placeholder,
  maxHeight,
  styleProp,
  style,
  onTextChange,
  text,
}: AppTextInputProps) {
  const inputRef = useRef<TextInput | null>(null);

  return (
    <AppContainer selfAlignment="stretch" styleProp={styleProp}>
      <TextInput
        style={[
          styles.input,
          {
            maxHeight,
            borderRadius: !multiline ? SIZE_4 : 0,
            backgroundColor:
              !multiline && style === "solid" ? "#e1e1e1" : "transparent",
            borderWidth: !multiline ? 4 * StyleSheet.hairlineWidth : 0,
            borderColor:
              !multiline && style === "outline" ? "#e1e1e1" : "transparent",
          },
        ]}
        placeholder={placeholder}
        multiline={multiline}
        onChangeText={onTextChange}
        value={text}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: SIZE_3,
    lineHeight: SIZE_3,
    alignSelf: "stretch",
    paddingVertical: SIZE_4,
    paddingHorizontal: SIZE_4 * 2,
  },
});
