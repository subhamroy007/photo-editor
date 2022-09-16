import { SafeAreaView } from "react-native-safe-area-context";
import { Label } from "../../components/utility/Label";
import { globalStyles } from "../../constants/style";

export function CloseToMe() {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <Label size="extra-large" text="Close To Me" />
    </SafeAreaView>
  );
}
