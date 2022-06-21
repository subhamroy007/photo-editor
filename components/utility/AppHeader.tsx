import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLOR_7,
  COLOR_8,
  HEADER_HEIGHT,
  SIZE_5,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { AppLabel } from "./AppLabel";

export type AppHeader = {
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  title?: string;
};

export function AppHeader({
  transparent,
  style,
  headerLeft,
  headerRight,
  title,
}: AppHeader) {
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[globalStyles.absolutePosition, styles.headerContainer, style]}
    >
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.alignCenter,
          globalStyles.justifyCenter,
          styles.header,
          {
            backgroundColor: transparent === true ? "transparent" : COLOR_8,
          },
        ]}
      >
        {headerLeft && (
          <View style={[globalStyles.absolutePosition, styles.headerLeft]}>
            {headerLeft}
          </View>
        )}
        {title && (
          <AppLabel
            size="large"
            style="bold"
            text={title}
            foreground={transparent === true ? COLOR_8 : COLOR_7}
            styleProp={styles.title}
          />
        )}
        {headerRight && (
          <View style={[globalStyles.absolutePosition, styles.headerRight]}>
            {headerRight}
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
    alignSelf: "stretch",
    height: HEADER_HEIGHT,
  },
  headerLeft: {
    left: SIZE_5,
  },
  headerRight: {
    right: SIZE_5,
  },
  title: {
    maxWidth: "64%",
  },
});
