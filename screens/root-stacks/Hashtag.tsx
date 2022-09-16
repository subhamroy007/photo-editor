import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { HashtagScreenProps } from "../../constants/types";

export function Hashtag({
  navigation,
  route: {
    params: { name },
  },
}: HashtagScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={name}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
