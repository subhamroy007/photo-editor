import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Label } from "../components/utility/Label";
import { SIZE_12 } from "../constants/constants";
import { globalStyles } from "../constants/style";
import { SuggestedMoments } from "../screens/suggested-tabs-screens/SuggestedMoments";
import { SuggestedPhotos } from "../screens/suggested-tabs-screens/SuggestedPhotos";
import { SuggestedVideos } from "../screens/suggested-tabs-screens/SuggestedVideos";

export type SuggestedTabsParams = {
  Moments: undefined;
  Videos: undefined;
  Photos: undefined;
};

const Tab = createMaterialTopTabNavigator<SuggestedTabsParams>();

export function SuggestedTabs() {
  return (
    <Tab.Navigator
      backBehavior="none"
      overScrollMode="never"
      sceneContainerStyle={globalStyles.primaryDarkBackgroundColor}
      screenOptions={{
        tabBarIndicatorStyle: { opacity: 0 },
        tabBarIndicatorContainerStyle: { opacity: 0 },
        tabBarStyle: [
          {
            width: "100%",
            height: SIZE_12,
          },
          globalStyles.absolutePosition,
          globalStyles.semiTransparentBackgroundColor,
        ],
        tabBarContentContainerStyle: globalStyles.alignCenter,
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 1,
      }}
    >
      <Tab.Screen
        name="Moments"
        component={SuggestedMoments}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Label
                text="Moments"
                // size="medium"
                transparent
                type={focused ? "primary" : "info"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Videos"
        component={SuggestedVideos}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Label
                text="Videos"
                // size="medium"
                transparent
                type={focused ? "primary" : "info"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Photos"
        component={SuggestedPhotos}
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Label
                text="Photos"
                // size="medium"
                transparent
                type={focused ? "primary" : "info"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
