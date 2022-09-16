import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { EffectScreenProps } from "../../constants/types";

export function Effect({
  navigation,
  route: {
    params: { id },
  },
}: EffectScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={"Effect"}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
