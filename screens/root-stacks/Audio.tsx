import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { AudioScreenProps } from "../../constants/types";

export function Audio({
  navigation,
  route: {
    params: { id },
  },
}: AudioScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={"Audio"}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
