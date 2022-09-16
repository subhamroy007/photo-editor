import { useFocusEffect } from "@react-navigation/native";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { SCREEN_HEIGHT } from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useAppInfo } from "../../hooks/useAppInfo";
import { useStatusBar } from "../../hooks/useStatusBar";

export type ScreenProps = {
  type?: "feed" | "partial-fullscreen" | "fullscreen";
  children?: ReactNode;
};

export function Screen({ type, children }: ScreenProps) {
  type = type ? type : "feed";

  const { theme } = useAppInfo();

  const { hideStatusBar, setToDarkContent, setToLightContent, showStatusBar } =
    useStatusBar();

  const hasNotch = SCREEN_HEIGHT > 960;

  const dispatch = useDispatch();

  useFocusEffect(() => {
    if (type === "feed") {
      showStatusBar();
      if (theme === "light") {
        setToDarkContent();
      } else {
        setToLightContent();
      }
    } else if (type === "partial-fullscreen") {
      // dispatch(activateFullScreen());
      if (hasNotch) {
        showStatusBar();
        setToLightContent();
      } else {
        hideStatusBar();
      }
    } else {
      hideStatusBar();
    }

    return () => {
      if (type === "partial-fullscreen") {
        // dispatch(deActivateFullScreen());
      }
    };
  });

  return (
    <SafeAreaView
      edges={[
        "left",
        "right",
        "bottom",
        type === "feed" || hasNotch ? "top" : "left",
      ]}
      style={[
        globalStyles.flex1,
        type === "feed" && theme === "light"
          ? globalStyles.primaryLightBackgroundColor
          : globalStyles.primaryDarkBackgroundColor,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}
