import { Screen } from "../components/utility/Screen";
import { useAppInfo } from "../hooks/useAppInfo";
import { KeyboardAvoidingView, View, TextInput } from "react-native";
import { globalStyles } from "../constants/style";
import { Avatar } from "../components/utility/Avatar";
import { RoundIcon } from "../components/utility/RoundIcon";
import { Label } from "../components/utility/Label";
import { COLOR_1 } from "../constants/constants";
import { Icon } from "../components/utility/Icon";
import { AccountShortListItem } from "../components/post/account/AccountShortListItem";
import { AccountShortList } from "../components/post/account/AccountShortList";

function CommentBox() {
  const { profilePicture } = useAppInfo();

  return (
    <KeyboardAvoidingView
      style={[globalStyles.absolutePosition, { width: "100%" }]}
    >
      <View
        style={[
          globalStyles.flexRow,
          globalStyles.alignCenter,
          globalStyles.primaryTopBorderWidth,
          globalStyles.primaryLightBorderColor,
          globalStyles.paddingHorizontalSize4,
          globalStyles.paddingVerticalSize3,
        ]}
      >
        <Avatar image={profilePicture} />
        <TextInput
          style={[
            globalStyles.flex1,
            globalStyles.marginLeftSize4,
            globalStyles.marginRightSize4,
          ]}
          placeholder="Leave your opinion..."
        />
        <RoundIcon name="arrow-right" style="solid" gap="small" transparent />
      </View>
    </KeyboardAvoidingView>
  );
}

export function TempScreen() {
  return (
    <Screen>
      <AccountShortList
        onSelect={(userid) => {
          console.log(userid, "selected");
        }}
        accounts={[
          {
            profilePicture: {
              uri: "https://static.toiimg.com/thumb/61934701.cms?width=170&height=240&imgsize=18050",
              height: 240,
              width: 170,
            },
            userid: "roybond007",
            username: "Subham Roy",
          },
        ]}
      />
      <View style={[globalStyles.flex1, globalStyles.justifyEnd]}>
        <CommentBox />
      </View>
    </Screen>
  );
}
