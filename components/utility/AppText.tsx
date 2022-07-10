import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import {
  COLOR_1,
  COLOR_6,
  COLOR_7,
  COLOR_8,
  SIZE_25,
} from "../../constants/constants";
import { getTextSections } from "../../constants/utility";

export type AppTextProps = {
  text: string;
  onPress: (phase: string) => void;
  style?: StyleProp<TextStyle>;
  isTransparent?: boolean;
  isExpanded?: boolean;
};

export function AppText({
  text,
  onPress,
  style,
  isTransparent,
  isExpanded,
}: AppTextProps) {
  const sections = getTextSections(text);

  return (
    <Text
      ellipsizeMode="tail"
      style={[styles.text, { color: isTransparent ? COLOR_8 : COLOR_7 }, style]}
      onPress={() => {
        onPress("");
      }}
      numberOfLines={isExpanded ? 2000 : 2}
    >
      {sections.map((section, index) => {
        if (section.startsWith("#") || section.startsWith("@")) {
          return (
            <Text
              style={{ color: isTransparent ? COLOR_6 : COLOR_1 }}
              key={section + index}
              onPress={() => {
                onPress(section);
              }}
            >
              {section}
            </Text>
          );
        } else {
          return <Text key={section + index}>{section}</Text>;
        }
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: SIZE_25,
    fontFamily: "roboto-regular",
  },
});
