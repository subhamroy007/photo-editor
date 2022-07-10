import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  RootMaterialTopTabNavigatorParams,
  RootStackNavigatorParams,
} from "../constants/types";
import { Comments } from "../screens/root-stacks/Comments";
import { TempScreen } from "../screens/TempScreen";
import { RootBottomTabNavigatior } from "./RootBottomTabNavigator";
import { RootMaterialTopTabNavigator } from "./RootMaterialTopTabNavigator";

const Tab = createNativeStackNavigator<RootStackNavigatorParams>();

export function RootStackNavigator() {
  return (
    <Tab.Navigator
      id="root-stack-navigator"
      screenOptions={{
        gestureEnabled: false,
        customAnimationOnGesture: false,
        fullScreenGestureEnabled: false,
        headerShown: false,
        headerTransparent: true,
        animation: "slide_from_bottom",
      }}
      initialRouteName="MaterialTopTabs"
    >
      <Tab.Screen
        name="MaterialTopTabs"
        component={RootMaterialTopTabNavigator}
        getId={() => "root-material-top-tab-navigator"}
        navigationKey="root-material-top-tab-navigator"
      />
      <Tab.Screen
        name="TempScreen"
        component={TempScreen}
        navigationKey="temp-screen"
      />
      <Tab.Screen
        name="Comments"
        component={Comments}
        navigationKey="comments"
        getId={() => "comments"}
      />
    </Tab.Navigator>
  );
}
