import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "../constants/style";
import { useStatusBar } from "../hooks/useStatusBar";
import { Image } from "react-native";

export function TempScreen() {
  useStatusBar();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        globalStyles.flex1,
        { backgroundColor: "white" },
        globalStyles.stretchSelf,
        globalStyles.justifyCenter,
        globalStyles.alignCenter,
        globalStyles.flexRow,
      ]}
    >
      <Image
        source={require("../assets/icons/logo.png")}
        resizeMode="cover"
        style={{ width: 300, height: 300, backgroundColor: "red" }}
        fadeDuration={0}
      />
    </SafeAreaView>
  );
}
