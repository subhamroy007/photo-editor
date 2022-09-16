import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Shutter } from "../components/utility/Shutter";
import { RootBottomTabNavigatorParams } from "../constants/types";
import { Account } from "../screens/root-bottom-tabs/Account";
import { Chat } from "../screens/root-bottom-tabs/Chat";
import { Notification } from "../screens/root-bottom-tabs/Notification";
import { ShortsFeed } from "../screens/root-bottom-tabs/ShortsFeed";
import { VideoFeed } from "../screens/root-bottom-tabs/VideoFeed";
import { HomeStacks } from "./HomeStacks";
import { SuggestedTabs } from "./SuggestedTabs";

const Tab = createBottomTabNavigator<RootBottomTabNavigatorParams>();

export function RootBottomTabNavigatior() {
  return (
    <Tab.Navigator
      backBehavior="history"
      id="root-bottom-tab-navigator"
      initialRouteName="HomeStacks"
      detachInactiveScreens
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      tabBar={(props) => <Shutter {...props} />}
    >
      <Tab.Screen
        name="HomeStacks"
        component={HomeStacks}
        getId={() => "home-stacks"}
        navigationKey="home-stacks"
      />
      <Tab.Screen
        name="SuggestedTabs"
        component={SuggestedTabs}
        getId={() => "suggested-tabs"}
        navigationKey="suggested-tabs"
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        getId={() => "notification"}
        navigationKey="notification"
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        getId={() => "account"}
        navigationKey="account"
      />
    </Tab.Navigator>
  );
}
