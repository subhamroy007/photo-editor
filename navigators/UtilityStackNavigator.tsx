import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UtilityStackNavigatorParams } from "../constants/types";
import { Profile } from "../screens/utility-stacks/Profile";

const Tab = createNativeStackNavigator<UtilityStackNavigatorParams>();

export function UtilityStackNavigator() {
  return (
    <Tab.Navigator
      id="utility-stack-navigator"
      screenOptions={{
        gestureEnabled: false,
        customAnimationOnGesture: false,
        fullScreenGestureEnabled: false,
        headerShown: false,
        headerTransparent: true,
        animation: "slide_from_right",
      }}
      initialRouteName="Profile"
    >
      <Tab.Screen
        name="Profile"
        navigationKey="profile"
        getId={({ params: { userId } }) => "profile-" + userId}
        component={Profile}
      />
    </Tab.Navigator>
  );
}
