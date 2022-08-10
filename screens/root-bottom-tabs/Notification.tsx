import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { selectAppTheme } from "../../api/global/appSelector";
import { globalStyles } from "../../constants/style";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export function Notification() {
  const theme = useStoreSelector(selectAppTheme);

  const { showStatusBar, setToDarkContent } = useStatusBar();

  useFocusEffect(() => {
    showStatusBar();
    setToDarkContent();
  });

  return (
    <SafeAreaView
      style={[
        theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
        globalStyles.flex1,
      ]}
    ></SafeAreaView>
  );
}
