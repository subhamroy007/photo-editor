import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";
import { LikesScreenProps } from "../../constants/types";

export function Likes({ navigation, route: { params } }: LikesScreenProps) {
  return (
    <Screen>
      <AppHeader
        leftIcon="arrow-left"
        title={"Likes"}
        onLeftIconPress={navigation.goBack}
      />
    </Screen>
  );
}
