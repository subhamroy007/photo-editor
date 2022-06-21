import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/constants";
import { RootMaterialTopTabNavigatorParams } from "../constants/types";
import { Chat } from "../screens/root-material-top-tabs/Chat";
import { CreateContent } from "../screens/root-material-top-tabs/CreateContent";
import { RootBottomTabNavigatior } from "./RootBottomTabNavigator";

const Tab = createMaterialTopTabNavigator<RootMaterialTopTabNavigatorParams>();

export function RootMaterialTopTabNavigator() {
  return (
    <Tab.Navigator
      backBehavior="history"
      id="root-material-top-tab-navigator"
      initialRouteName="BottomTabs"
      keyboardDismissMode="on-drag"
      overScrollMode="never"
      overdrag={false}
      initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      screenOptions={{ lazy: false }}
      tabBar={() => null}
    >
      <Tab.Screen
        name="CreateContent"
        component={CreateContent}
        getId={() => "create-content"}
        navigationKey="create-content"
      />
      <Tab.Screen
        name="BottomTabs"
        getId={() => "root-bottom-tab-navigator"}
        component={RootBottomTabNavigatior}
        navigationKey="root-bottom-tab-navigator"
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        getId={() => "chat"}
        navigationKey="chat"
      />
    </Tab.Navigator>
  );
}
