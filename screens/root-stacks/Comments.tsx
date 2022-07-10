import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/utility/AppHeader";
import { globalStyles } from "../../constants/style";
import { RootStackNavigatorParams } from "../../constants/types";

type CommentsNavigationParams = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Comments"
>;

export function Comments({
  navigation,
  route: {
    params: { postId },
  },
}: CommentsNavigationParams) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <AppHeader
        leftIcon="arrow-left"
        title={"Comments"}
        onLeftIconPress={navigation.goBack}
      />
    </SafeAreaView>
  );
}
