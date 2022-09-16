import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Label } from "../../components/utility/Label";
import { globalStyles } from "../../constants/style";
import { RootStackNavigatorParams } from "../../constants/types";

export type LikesScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Chat"
>;

export function Chat({ navigation }: LikesScreenProps) {
  return (
    <SafeAreaView
      edges={["bottom", "left", "right", "top"]}
      style={[globalStyles.flex1, globalStyles.primaryLightBackgroundColor]}
    >
      <Pressable
        onPress={() => {
          navigation.navigate("CloseToMe");
        }}
      >
        <Label
          size="extra-large"
          text="Favourites"
          gap="extra-large"
          backgroundVisible
        />
      </Pressable>
      <Pressable>
        <Label
          size="extra-large"
          text="Favourites"
          gap="extra-large"
          backgroundVisible
        />
      </Pressable>
    </SafeAreaView>
  );
}
