import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { ContentCategory } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppHeader } from "../utility/AppHeader";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";
import { ContentCategoryContainer } from "./ContentCategoryContainer";

export function SelectContentCategory({
  onCategorySelect,
}: {
  onCategorySelect: (category: ContentCategory) => void;
}) {
  const onPhotoSelect = useCallback(() => {
    onCategorySelect("photo");
  }, [onCategorySelect]);

  const onVideoSelect = useCallback(() => {
    // onCategorySelect("video");
  }, [onCategorySelect]);

  const onStorySelect = useCallback(() => {
    // onCategorySelect("story");
  }, [onCategorySelect]);

  const onShortsSelect = useCallback(() => {
    // onCategorySelect("shorts");
  }, [onCategorySelect]);

  return (
    <AppContainer
      backgroundColor="#292929"
      selfAlignment="stretch"
      stretchToFill={true}
    >
      <AppHeader
        leftContainerChild={<AppIcon name="cross" foreground="white" />}
        middleContainerChild={
          <AppLabel text="Create" style="bold" size="large" />
        }
      />
      <AppContainer
        selfAlignment="stretch"
        stretchToFill={true}
        majorAxisAlignment="evenly"
        minorAxisAlignment="center"
        contentAlignment="stretch"
        contentOrientation="row"
        wrapContent={true}
      >
        <ContentCategoryContainer
          label="Photo"
          icon="landscape"
          onSelect={onPhotoSelect}
        />
        <ContentCategoryContainer
          label="Video"
          icon="video"
          onSelect={onVideoSelect}
        />
        <ContentCategoryContainer
          label="Story"
          icon="story"
          onSelect={onStorySelect}
        />
        <ContentCategoryContainer
          label="Shorts"
          icon="shorts"
          onSelect={onShortsSelect}
        />
      </AppContainer>
    </AppContainer>
  );
}
