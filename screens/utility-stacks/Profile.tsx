import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/utility/AppHeader";
import { globalStyles } from "../../constants/style";
import {
  RootBottomTabNavigatorParams,
  RootMaterialTopTabNavigatorParams,
  RootStackNavigatorParams,
  UtilityStackNavigatorParams,
} from "../../constants/types";

type ProfileNavigationParams = CompositeScreenProps<
  NativeStackScreenProps<UtilityStackNavigatorParams, "Profile">,
  CompositeScreenProps<
    BottomTabScreenProps<RootBottomTabNavigatorParams, "UtilityStacks">,
    CompositeScreenProps<
      MaterialTopTabScreenProps<
        RootMaterialTopTabNavigatorParams,
        "BottomTabs"
      >,
      NativeStackScreenProps<RootStackNavigatorParams, "MaterialTopTabs">
    >
  >
>;

export function Profile({
  navigation,
  route: {
    params: { userId },
  },
}: ProfileNavigationParams) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <AppHeader
        leftIcon="arrow-left"
        title={userId}
        onLeftIconPress={navigation.goBack}
      />
    </SafeAreaView>
  );
}
