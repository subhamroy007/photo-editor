import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { AccountScreenProps } from "../../constants/types";

export function Account({
  navigation,
  route: {
    params: { userid },
  },
}: AccountScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={userid}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
