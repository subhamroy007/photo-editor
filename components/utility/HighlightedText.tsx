import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { selectAppTheme } from "../../api/global/appSelector";
import {
  COLOR_1,
  COLOR_19,
  COLOR_7,
  COLOR_8,
  SIZE_25,
} from "../../constants/constants";
import { RootBotttomTabsNavigationProp } from "../../constants/types";
import { getTextSections } from "../../constants/utility";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export type HighlightedTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  noOfLines?: number;
  transparent?: boolean;
  author?: string;
};

export function HighlightedText({
  text,
  style,
  noOfLines,
  transparent,
  author,
}: HighlightedTextProps) {
  const navigation = useNavigation<RootBotttomTabsNavigationProp>();

  const theme = useStoreSelector(selectAppTheme);

  const sections = getTextSections(text);

  const navigateTo = useCallback(
    (value: string) => {
      if (value.startsWith("@")) {
        navigation.push("BottomTabs", {
          screen: "UtilityStacks",
          params: { screen: "Profile", params: { userid: value.slice(1) } },
        });
      } else {
        navigation.push("BottomTabs", {
          screen: "UtilityStacks",
          params: { screen: "Hashtag", params: { hashtag: value } },
        });
      }
    },
    [navigation]
  );

  return (
    <Text
      ellipsizeMode="tail"
      style={[
        styles.text,
        { color: transparent || theme === "dark" ? COLOR_8 : COLOR_7 },
        style,
      ]}
      numberOfLines={noOfLines !== undefined ? noOfLines : 2000}
    >
      {author && (
        <Text
          style={styles.boldText}
          onPress={() => {
            navigateTo(author);
          }}
        >
          {author + " "}
        </Text>
      )}
      {sections.map((section, index) => {
        if (section.startsWith("#") || section.startsWith("@")) {
          return (
            <Text
              style={{ color: transparent ? COLOR_19 : COLOR_1 }}
              key={section + index}
              onPress={() => {
                navigateTo(section);
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
  boldText: {
    fontSize: SIZE_25,
    fontFamily: "roboto-medium",
  },
});
