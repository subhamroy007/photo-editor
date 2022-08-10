import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackNavigatorParams } from "../constants/types";
import { Chat } from "../screens/root-stacks/Chat";
import { CreateContent } from "../screens/root-stacks/CreateContent";
import { TempScreen } from "../screens/TempScreen";
import { CloseToMe } from "../screens/root-stacks/CloseToMe";
import { RootBottomTabNavigatior } from "./RootBottomTabNavigator";
import { LikesScreen } from "../screens/root-stacks/LikesScreen";

const Tab = createNativeStackNavigator<RootStackNavigatorParams>();

export function RootStackNavigator() {
  return (
    <Tab.Navigator
      id="root-stack-navigator"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        headerTransparent: true,
        animation: "slide_from_left",
      }}
      initialRouteName="BottomTabs"
    >
      <Tab.Screen
        name="BottomTabs"
        component={RootBottomTabNavigatior}
        getId={() => "root-bottom-tab-navigator"}
        navigationKey="root-bottom-tab-navigator"
      />
      <Tab.Screen
        name="TempScreen"
        component={TempScreen}
        navigationKey="temp-screen"
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        navigationKey="chat"
        getId={() => "chat"}
      />
      <Tab.Screen
        name="CreateContent"
        component={CreateContent}
        navigationKey="create-content"
        getId={() => "create-content"}
      />
      <Tab.Screen
        name="CloseToMe"
        component={CloseToMe}
        navigationKey="close-to-me"
        getId={() => "close-to-me"}
      />
      <Tab.Screen
        name="LikesScreen"
        component={LikesScreen}
        navigationKey="likes"
        getId={() => "likes"}
        options={{ presentation: "transparentModal" }}
      />
    </Tab.Navigator>
  );
}
