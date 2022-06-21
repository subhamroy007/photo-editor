import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/utility/AppHeader";
import { AppIcon } from "../../components/utility/AppIcon";
import { LOGO_SIZE } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStatusBar } from "../../hooks/useStatusBar";

export function HomeFeed() {
  useStatusBar();

  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, { backgroundColor: "white" }]}
    >
      <AppHeader
        headerLeft={
          <Image
            source={require("../../assets/icons/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        }
        headerRight={<AppIcon foreground="black" name="search-bold" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
