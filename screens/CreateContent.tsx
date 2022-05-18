import { useCallback, useEffect, useState } from "react";
import { Image, StatusBar } from "react-native";
import { SelectPhoto } from "../components/create-content/SelectPhoto";
import { SwitchContentTypeModal } from "../components/create-content/SwitchContentTypeModal";
import { AppContainer } from "../components/utility/AppContainer";
import { AppLabel } from "../components/utility/AppLabel";
import { AppPressable } from "../components/utility/AppPressable";
import { ContentType } from "../constants/types";
import { useLocalMedia } from "../hooks/useLocalMedia";
import { useVideoProcessor } from "../hooks/useVideoProcessor";

export function CreateContent() {
  const [contentType, setContentType] = useState<ContentType>("PHOTO");

  const [showContentSwitchModal, setContentSwitchModal] = useState(false);

  const onSwitch = useCallback((value) => {
    setContentType(value);
    setContentSwitchModal(false);
  }, []);

  return (
    <AppContainer
      stretchToFill={true}
      selfAlignment="stretch"
      backgroundColor="#1f1f1f"
    >
      <StatusBar hidden={true} />
      <SelectPhoto />
      <AppPressable
        styleProp={{ position: "absolute", bottom: 16, opacity: 0.8 }}
        disableLongPress={true}
        onTap={() => {
          setContentSwitchModal((prevState) => !prevState);
        }}
      >
        <AppLabel
          text={contentType}
          foreground="white"
          size="medium"
          style="regular"
        />
      </AppPressable>

      {showContentSwitchModal && <SwitchContentTypeModal onSwitch={onSwitch} />}
    </AppContainer>
  );
}
