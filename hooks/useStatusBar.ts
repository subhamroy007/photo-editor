import { useCallback, useEffect } from "react";
import { StatusBar } from "react-native";
import { selectAppTheme } from "../api/global/appSelector";
import { useStoreSelector } from "./useStoreSelector";

export function useStatusBar(
  visible: boolean = true,
  contentStyle: "light" | "dark" = "dark"
) {
  const theme = useStoreSelector(selectAppTheme);

  const reset = useCallback(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }, []);

  useEffect(() => {
    reset();
    StatusBar.setHidden(!visible, "slide");
  }, []);

  useEffect(() => {
    reset();
    StatusBar.setBarStyle(
      theme === "dark" || contentStyle === "light"
        ? "light-content"
        : "dark-content",
      true
    );
  }, [theme, contentStyle]);

  const showStatusBar = useCallback(() => {
    reset();
    StatusBar.setHidden(false, "slide");
  }, []);

  const hideStatusBar = useCallback(() => {
    reset();
    StatusBar.setHidden(true, "slide");
  }, []);

  const setToLightContent = useCallback(() => {
    reset();
    StatusBar.setBarStyle("light-content");
  }, []);

  const setToDarkContent = useCallback(() => {
    reset();
    StatusBar.setBarStyle("dark-content");
  }, []);

  return {
    showStatusBar,
    hideStatusBar,
    setToLightContent,
    setToDarkContent,
  };
}
