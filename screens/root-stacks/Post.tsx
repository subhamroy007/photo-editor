import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { PostScreenProps } from "../../constants/types";

export function Post({
  navigation,
  route: {
    params: { id },
  },
}: PostScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={"Post"}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
