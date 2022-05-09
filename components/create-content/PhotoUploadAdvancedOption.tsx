import { useCallback } from "react";
import { Switch } from "react-native";
import { SIZE_5 } from "../../constants/constants";
import { AppContainer } from "../utility/AppContainer";
import { AppLabel } from "../utility/AppLabel";

export type PhotoUploadAdvancedOptionProps = {
  showLikeCount: boolean;
  isCommentEnabled: boolean;
  toggleLikeSwitch: (value: boolean) => void;
  toggleCommentSwitch: (value: boolean) => void;
};

export function PhotoUploadAdvancedOption({
  isCommentEnabled,
  showLikeCount,
  toggleCommentSwitch,
  toggleLikeSwitch,
}: PhotoUploadAdvancedOptionProps) {
  const onCommentPress = useCallback(() => {
    toggleCommentSwitch(!isCommentEnabled);
  }, [toggleCommentSwitch, isCommentEnabled]);

  const onLikePress = useCallback(() => {
    toggleLikeSwitch(!showLikeCount);
  }, [toggleLikeSwitch, showLikeCount]);

  return (
    <AppContainer selfAlignment="stretch">
      <AppContainer
        selfAlignment="stretch"
        paddingBottom={SIZE_5}
        paddingTop={SIZE_5}
        paddingLeft={SIZE_5}
        paddingRight={SIZE_5}
        contentOrientation="row"
        majorAxisAlignment="between"
        onPress={onLikePress}
      >
        <AppLabel text="Show Likes Count" foreground="black" />
        <Switch
          value={showLikeCount}
          onValueChange={toggleLikeSwitch}
          thumbColor="grey"
        />
      </AppContainer>
      <AppContainer
        selfAlignment="stretch"
        paddingBottom={SIZE_5}
        paddingTop={SIZE_5}
        paddingLeft={SIZE_5}
        paddingRight={SIZE_5}
        contentOrientation="row"
        majorAxisAlignment="between"
        onPress={onCommentPress}
      >
        <AppLabel text="Enable Comments" foreground="black" />
        <Switch
          value={isCommentEnabled}
          onValueChange={toggleCommentSwitch}
          thumbColor="grey"
        />
      </AppContainer>
    </AppContainer>
  );
}
