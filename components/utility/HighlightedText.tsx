import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_1,
  COLOR_19,
  COLOR_7,
  COLOR_8,
  SIZE_25,
} from "../../constants/constants";
import { getTextSections } from "../../constants/utility";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export type HighlightedTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  noOfLines?: number;
  transparent?: boolean;
};

export function HighlightedText({
  text,
  style,
  noOfLines,
  transparent,
}: HighlightedTextProps) {
  const theme = useStoreSelector(selectAppTheme);

  const sections = getTextSections(text);

  return (
    <Text
      ellipsizeMode="tail"
      style={[
        styles.text,
        {
          color: transparent || theme === "dark" ? COLOR_8 : COLOR_7,
          lineHeight: noOfLines === 1 ? SIZE_25 : undefined,
        },
        style,
      ]}
      numberOfLines={noOfLines !== undefined ? noOfLines : 2000}
    >
      {sections.map((section, index) => {
        if (section.startsWith("#") || section.startsWith("@")) {
          return (
            <Text
              style={{ color: transparent ? COLOR_19 : COLOR_1 }}
              key={section + index}
              onPress={() => {
                if (section.startsWith("&")) {
                } else {
                }
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
