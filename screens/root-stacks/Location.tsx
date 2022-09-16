import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { LocationScreenProps } from "../../constants/types";

export function Location({
  navigation,
  route: {
    params: { name },
  },
}: LocationScreenProps) {
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
