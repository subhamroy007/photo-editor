import { RootStackNavigatorParams } from "../constants/types";
import { Chat } from "../screens/root-bottom-tabs/Chat";
import { CreateContent } from "../screens/root-stacks/CreateContent";
import { TempScreen } from "../screens/TempScreen";
import { CloseToMe } from "../screens/root-stacks/CloseToMe";
import { RootBottomTabNavigatior } from "./RootBottomTabNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Account } from "../screens/root-stacks/Account";
import { Audio } from "../screens/root-stacks/Audio";
import { Effect } from "../screens/root-stacks/Effect";
import { Hashtag } from "../screens/root-stacks/Hashtag";
import { Likes } from "../screens/root-stacks/Likes";
import { Location } from "../screens/root-stacks/Location";
import { Post } from "../screens/root-stacks/Post";
import { Story } from "../screens/root-stacks/Story";

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
        name="Account"
        component={Account}
        navigationKey="account"
        getId={() => "account"}
      />
      <Tab.Screen
        name="Audio"
        component={Audio}
        navigationKey="Audio"
        getId={() => "Audio"}
      />
      <Tab.Screen
        name="Effect"
        component={Effect}
        navigationKey="effect"
        getId={() => "effect"}
      />
      <Tab.Screen
        name="Hashtag"
        component={Hashtag}
        navigationKey="hashtag"
        getId={() => "hashtag"}
      />
      <Tab.Screen
        name="Likes"
        component={Likes}
        navigationKey="likes"
        getId={() => "likes"}
      />
      <Tab.Screen
        name="Location"
        component={Location}
        navigationKey="location"
        getId={() => "location"}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        navigationKey="post"
        getId={() => "post"}
      />
      <Tab.Screen
        name="Story"
        component={Story}
        navigationKey="account"
        getId={() => "account"}
      />
    </Tab.Navigator>
  );
}
