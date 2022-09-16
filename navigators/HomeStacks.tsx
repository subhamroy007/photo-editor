import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStacksParams } from "../constants/types";
import { Favourites } from "../screens/home-stacks-screens/Favourites";
import { Followings } from "../screens/home-stacks-screens/Followings";
import { HomeFeed } from "../screens/home-stacks-screens/HomeFeed";
import { Suggested } from "../screens/home-stacks-screens/Suggested";

const Stack = createNativeStackNavigator<HomeStacksParams>();

export function HomeStacks() {
  return (
    <Stack.Navigator
      id="home-stacks"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        animation: "slide_from_right",
      }}
      initialRouteName="HomeFeed"
    >
      <Stack.Screen
        name="HomeFeed"
        component={HomeFeed}
        getId={() => "home-feed"}
        navigationKey="home-feed"
      />
      <Stack.Screen
        name="Favourites"
        navigationKey="favourites"
        getId={() => "favourites"}
        component={Favourites}
      />
      <Stack.Screen
        name="Followings"
        navigationKey="followings"
        getId={() => "followings"}
        component={Followings}
      />
      <Stack.Screen
        name="Suggested"
        navigationKey="suggested"
        getId={() => "suggested"}
        component={Suggested}
      />
    </Stack.Navigator>
  );
}
