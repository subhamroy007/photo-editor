import { StatusBar } from "react-native";
import { PhotoUploadUtilityButton } from "../components/create-content/PhotoUploadUtilityButton";
import { AppContainer } from "../components/utility/AppContainer";

export function TempScreen() {
  return (
    <AppContainer
      stretchToFill={true}
      selfAlignment="stretch"
      backgroundColor="white"
      majorAxisAlignment="end"
      paddingBottom={60}
    >
      <StatusBar hidden={true} />
      <PhotoUploadUtilityButton isMultiSelected />
    </AppContainer>
  );
}
