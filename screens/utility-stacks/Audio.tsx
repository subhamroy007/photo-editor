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

type AudioNavigationParams = CompositeScreenProps<
  NativeStackScreenProps<UtilityStackNavigatorParams, "Audio">,
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

export function Audio({
  navigation,
  route: {
    params: { audioId },
  },
}: AudioNavigationParams) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <AppHeader
        leftIcon="arrow-left"
        title={"Audio"}
        onLeftIconPress={navigation.goBack}
      />
    </SafeAreaView>
  );
}
