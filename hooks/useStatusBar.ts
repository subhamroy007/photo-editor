import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { COLOR_7, COLOR_8 } from "../constants/constants";

export function useStatusBar(
  type: "dark" | "light" = "light",
  initialVisibilityStatus: boolean = true
) {
  const [isVisible, setVisible] = useState(initialVisibilityStatus);

  const reset = useCallback(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor(type === "dark" ? COLOR_7 : COLOR_8);
    StatusBar.setBarStyle(
      type === "dark" ? "light-content" : "dark-content",
      false
    );
  }, [type]);

  useEffect(() => {
    reset();
    StatusBar.setHidden(!initialVisibilityStatus, "slide");
  }, [reset]);

  const showStatusBar = useCallback(() => {
    reset();
    StatusBar.setHidden(false, "slide");
    setVisible(true);
  }, [reset]);

  const hideStatusBar = useCallback(() => {
    reset();
    StatusBar.setHidden(true, "slide");
    setVisible(false);
  }, [reset]);

  return {
    isVisible,
    showStatusBar,
    hideStatusBar,
  };
}
