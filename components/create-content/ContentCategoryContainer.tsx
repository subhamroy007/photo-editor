import { StyleSheet } from "react-native";
import { SIZE_2, SIZE_5, SIZE_6 } from "../../constants/constants";
import { IconName } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { AppPressable } from "../utility/AppPressable";

export function ContentCategoryContainer({
  icon,
  label,
  onSelect,
}: {
  label: string;
  icon: IconName;
  onSelect: () => void;
}) {
  return (
    <AppPressable onPress={onSelect} isAnimated={true}>
      <AppContainer
        width={SIZE_2}
        height={SIZE_2 * 1.5}
        backgroundColor={"#393939"}
        borderRadius={SIZE_5}
        majorAxisAlignment="center"
        minorAxisAlignment="center"
      >
        <AppIcon name={icon} size="large" />
        <AppLabel
          text={label}
          size="extra-large"
          styleProp={styles.label}
          style="bold"
        />
      </AppContainer>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: SIZE_6,
  },
});
