import { Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AppLabel } from "../components/utility/AppLabel";
import { AppModal } from "../components/utility/AppModal";
import { globalStyles } from "../constants/style";
import { useStatusBar } from "../hooks/useStatusBar";

export function TempScreen() {
  // const [isVisible, setVisible] = useState(false);

  useStatusBar();

  // const toggleVisibleState = useCallback(
  //   () => setVisible((prevState) => !prevState),
  //   []
  // );

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        globalStyles.flex1,
        { backgroundColor: "white" },
        globalStyles.justifyEnd,
      ]}
    ></SafeAreaView>
  );
}
