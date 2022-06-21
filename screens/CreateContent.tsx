import { useCallback, useState } from "react";
import { StatusBar } from "react-native";
import { SelectPhoto } from "../components/create-content/create-image-post/SelectPhoto";
import { SwitchContentTypeModal } from "../components/create-content/SwitchContentTypeModal";
import { AppContainer } from "../components/utility/AppContainer";
import { AppLabel } from "../components/utility/AppLabel";
import { AppPressable } from "../components/utility/AppPressable";
import { ContentType } from "../constants/types";

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
        styleProp={{ position: "absolute", bottom: 16 }}
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
          type="solid"
          background="rgba(0, 0, 0, 0.7)"
          gap="small"
          corner="small-round"
        />
      </AppPressable>

      {showContentSwitchModal && <SwitchContentTypeModal onSwitch={onSwitch} />}
    </AppContainer>
  );
}
