import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { COLOR_1, COLOR_7, SIZE_25 } from "../../constants/constants";

export type AppText = {
  text: string;
  onPress: (phase: string) => void;
  noOfLines?: number;
  styleProp?: StyleProp<TextStyle>;
  foreground?: string;
  selfAlignment?: "stretch" | "center" | "start" | "end";
  highlight?: string;
};

export function getTextSections(text: string) {
  const pattern = /(#([A-z]|[0-9]|_)+|@([A-z]|_)([A-z]|[0-9]|_)*)/m;
  let sections: string[] = [];

  while (text && text.length > 0) {
    //first look for the hashtag or mentions in the target string;
    const result = pattern.exec(text);
    let highlightedPhase = "";
    if (result) {
      highlightedPhase = result[0];
    }

    //find the index of both the phases
    let highlightedPhaseSearchIndex =
      highlightedPhase === "" ? 20000 : text.indexOf(highlightedPhase);

    //append the phase before the target phase and the phase itself to the section list;
    if (highlightedPhaseSearchIndex === 20000) {
      sections.push(text);
      break;
    }

    if (highlightedPhaseSearchIndex > 0) {
      sections.push(text.substring(0, highlightedPhaseSearchIndex));
    }
    sections.push(
      text.substring(
        highlightedPhaseSearchIndex,
        highlightedPhase.length + highlightedPhaseSearchIndex
      )
    );

    //cut the main string at the end of target phase
    text = text.substring(
      highlightedPhase.length + highlightedPhaseSearchIndex
    );
  }

  return sections;
}

export function AppText({
  text,
  onPress,
  noOfLines,
  styleProp,
  foreground,
  selfAlignment,
  highlight,
}: AppText) {
  const color = foreground ? foreground : COLOR_7;
  const highlightColor = highlight ? highlight : COLOR_1;
  let alignSelf: ViewStyle["alignSelf"] = undefined;

  switch (selfAlignment) {
    case "end":
      alignSelf = "flex-end";
      break;
    case "start":
      alignSelf = "flex-start";
      break;
    case "stretch":
      alignSelf = "stretch";
      break;
    case "center":
      alignSelf = "center";
      break;
  }

  const sections = getTextSections(text);

  return (
    <Text
      numberOfLines={noOfLines ? noOfLines : 2000}
      ellipsizeMode="tail"
      style={[styles.text, styleProp, { color, alignSelf }]}
      onPress={() => {
        onPress("");
      }}
    >
      {sections.map((section, index) => {
        if (section.startsWith("#") || section.startsWith("@")) {
          return (
            <Text
              style={{ color: highlightColor }}
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
    lineHeight: Math.floor(SIZE_25 * 1.3),
    fontFamily: "roboto-regular",
  },
});
