import { useCallback, useState } from "react";
import { StatusBar } from "react-native";
import { ContentCategory } from "../constants/types";
import { AppContainer } from "../components/utility/AppContainer";
import { SelectContentCategory } from "../components/create-content/SelectContentCategory";
import { PhotoList } from "../components/create-content/PhotoList";

export function CreateContent() {
  const [category, setCategory] = useState<ContentCategory | undefined>();

  const onCategorySelect = useCallback((category: ContentCategory) => {
    setCategory(category);
  }, []);

  return (
    <AppContainer selfAlignment="stretch" stretchToFill={true}>
      <StatusBar hidden={true} />
      {!category && (
        <SelectContentCategory onCategorySelect={onCategorySelect} />
      )}
      {category === "photo" && <PhotoList />}
    </AppContainer>
  );
}
