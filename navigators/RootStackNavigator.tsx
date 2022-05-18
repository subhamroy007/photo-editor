import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreateContent } from "../screens/CreateContent";
import { EditPhoto } from "../screens/EditPhoto";
import { PhotoUploadDetails } from "../screens/PhotoUploadDetails";
import { SelectedLocalPhotoPreview } from "../screens/SelectedLocalPhotoPreview";
import { MediaParams } from "../constants/types";
import { TempScreen } from "../screens/TempScreen";

export type RootStackNavigationParams = {
  CreateContent: undefined;
  SelectedLocalPhotoPreview: {
    list: MediaParams[];
  };
  EditPhoto: undefined;
  PhotoUploadDetails: {
    list: MediaParams[];
  };
  TempScreen: undefined;
};

const Tab = createNativeStackNavigator<RootStackNavigationParams>();

export function RootStackNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ header: () => null }}
      initialRouteName="TempScreen"
    >
      <Tab.Screen name="CreateContent" component={CreateContent} />
      <Tab.Screen
        name="SelectedLocalPhotoPreview"
        component={SelectedLocalPhotoPreview}
      />
      <Tab.Screen name="EditPhoto" component={EditPhoto} />
      <Tab.Screen name="PhotoUploadDetails" component={PhotoUploadDetails} />
      <Tab.Screen name="TempScreen" component={TempScreen} />
    </Tab.Navigator>
  );
}
