import { SafeAreaView } from "react-native-safe-area-context";
import { AppLabel } from "../../components/utility/AppLabel";
import { globalStyles } from "../../constants/style";

export function Settings() {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <AppLabel size="extra-large" text="Settings" />
    </SafeAreaView>
  );
}
