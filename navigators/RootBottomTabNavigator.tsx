import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Shutter } from "../components/utility/Shutter";
import { RootBottomTabNavigatorParams } from "../constants/types";
import { Account } from "../screens/root-bottom-tabs/Account";
import { HomeFeed } from "../screens/root-bottom-tabs/HomeFeed";
import { Notification } from "../screens/root-bottom-tabs/Notification";
import { ShortsFeed } from "../screens/root-bottom-tabs/ShortsFeed";
import { VideoFeed } from "../screens/root-bottom-tabs/VideoFeed";
import { UtilityStackNavigator } from "./UtilityStackNavigator";

const Tab = createBottomTabNavigator<RootBottomTabNavigatorParams>();

export function RootBottomTabNavigatior() {
  return (
    <Tab.Navigator
      backBehavior="history"
      id="root-bottom-tab-navigator"
      initialRouteName="HomeFeed"
      detachInactiveScreens
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
      }}
      tabBar={(props) => <Shutter {...props} />}
    >
      <Tab.Screen
        name="HomeFeed"
        component={HomeFeed}
        getId={() => "home-feed"}
        navigationKey="home-feed"
      />
      <Tab.Screen
        name="VideoFeed"
        component={VideoFeed}
        getId={() => "video-feed"}
        navigationKey="video-feed"
      />
      <Tab.Screen
        name="ShortsFeed"
        component={ShortsFeed}
        getId={() => "shorts-feed"}
        navigationKey="shorts-feed"
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        getId={() => "notification"}
        navigationKey="notification"
      />
      <Tab.Screen
        name="Account"
        component={Account}
        getId={() => "account"}
        navigationKey="account"
      />
      <Tab.Screen
        name="UtilityStacks"
        component={UtilityStackNavigator}
        getId={() => "utility-stack-navigator"}
        navigationKey="utility-stack-navigator"
      />
    </Tab.Navigator>
  );
}
