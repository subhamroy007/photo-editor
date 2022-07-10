import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UtilityStackNavigatorParams } from "../constants/types";
import { Audio } from "../screens/utility-stacks/Audio";
import { CloseToMe } from "../screens/utility-stacks/CloseToMe";
import { Effect } from "../screens/utility-stacks/Effect";
import { Favourites } from "../screens/utility-stacks/Favourites";
import { Hashtag } from "../screens/utility-stacks/Hashtag";
import { Location } from "../screens/utility-stacks/Location";
import { PostLikes } from "../screens/utility-stacks/PostLikes";
import { Profile } from "../screens/utility-stacks/Profile";
import { Saved } from "../screens/utility-stacks/Saved";
import { Settings } from "../screens/utility-stacks/Settings";

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
        animation: "slide_from_right",
      }}
    >
      <Tab.Screen
        name="Profile"
        navigationKey="profile"
        getId={({ params: { userId } }) => "profile-" + userId}
        component={Profile}
      />
      <Tab.Screen
        name="CloseToMe"
        navigationKey="closetome"
        getId={() => "closetome"}
        component={CloseToMe}
      />
      <Tab.Screen
        name="Favourites"
        navigationKey="favourites"
        getId={() => "favourites"}
        component={Favourites}
      />
      <Tab.Screen
        name="Saved"
        navigationKey="saved"
        getId={() => "saved"}
        component={Saved}
      />
      <Tab.Screen
        name="Settings"
        navigationKey="settings"
        getId={() => "settings"}
        component={Settings}
      />
      <Tab.Screen
        name="Audio"
        navigationKey="audio"
        getId={() => "audio"}
        component={Audio}
      />
      <Tab.Screen
        name="Effect"
        navigationKey="effect"
        getId={() => "effect"}
        component={Effect}
      />
      <Tab.Screen
        name="Location"
        navigationKey="location"
        getId={() => "location"}
        component={Location}
      />
      <Tab.Screen
        name="Hashtag"
        navigationKey="hashtag"
        getId={() => "hashtag"}
        component={Hashtag}
      />
      <Tab.Screen
        name="PostLikes"
        navigationKey="postlikes"
        getId={() => "postlikes"}
        component={PostLikes}
      />
    </Tab.Navigator>
  );
}
