import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectAccountItem } from "../../../api/accounts/accountSelector";
import { toggleAccountFollowing } from "../../../api/accounts/accountSlice";
import {
  selectAccountId,
  selectAppTheme,
} from "../../../api/global/appSelector";
import { COLOR_19, COLOR_5, COLOR_8 } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { RootBotttomTabsNavigationProp } from "../../../constants/types";
import { useStoreDispatch } from "../../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppLabel } from "../../utility/AppLabel";
import { AppPressable } from "../../utility/AppPressable";

export type AccountListItemProps = {
  userid: string;
  transparent?: boolean;
};

export const AccountListItem = React.memo<AccountListItemProps>(
  (props) => {
    const { userid, transparent } = props;

    const navigation = useNavigation<RootBotttomTabsNavigationProp>();

    const getAccount = useCallback(
      (state) => selectAccountItem(state, userid),
      [userid]
    );

    const theme = useStoreSelector(selectAppTheme);

    const account = useStoreSelector(getAccount, shallowEqual);

    const defaultUserid = useStoreSelector(selectAccountId);

    const dispatch = useStoreDispatch();

    const onFollowButtonPress = useCallback(() => {
      dispatch(toggleAccountFollowing(userid));
    }, [userid, dispatch]);

    const gotoAccount = useCallback(() => {
      navigation.push("BottomTabs", {
        screen: "UtilityStacks",
        params: { screen: "Profile", params: { userid } },
      });
    }, [navigation, userid]);

    const onAvatarPress = useCallback(() => {
      console.log("avatar pressed");
    }, []);

    return (
      <AppPressable
        onPress={gotoAccount}
        style={[
          globalStyles.flexRow,
          globalStyles.paddingVerticalSize2,
          globalStyles.paddingHorizontalSize4,
          globalStyles.alignCenter,
        ]}
      >
        <Pressable android_disableSound onPress={onAvatarPress}>
          <AppAvatar
            image={account.profilePicture}
            isActive={true}
            hasRing={account.hasUnSeenStory}
            size="large"
            transparent={transparent}
          />
        </Pressable>
        <View
          style={[
            globalStyles.flex2,
            globalStyles.alignStart,
            globalStyles.marginLeftSize4,
          ]}
        >
          <AppLabel
            text={account.userid}
            alignment="left"
            transparent={transparent}
          />
          <AppLabel
            text={account.username}
            type="info"
            transparent={transparent}
            alignment="left"
            styleProp={globalStyles.marginTopSize2}
          />
        </View>
        {defaultUserid !== account.userid && (
          <AppPressable
            style={[globalStyles.marginLeftSize4, globalStyles.flex1]}
            onPress={onFollowButtonPress}
          >
            <AppLabel
              text={account.isFollowing ? "following" : "follow"}
              backgroundVisible={!account.isFollowing}
              borderVisible={account.isFollowing}
              style="bold"
              gapVertical="medium"
              corner="small-round"
              transparent={transparent}
            />
          </AppPressable>
        )}
      </AppPressable>
    );
  },
  ({ transparent: prevTransparent }, { transparent: nextTransparent }) => {
    return prevTransparent === nextTransparent;
  }
);

const styles = StyleSheet.create({
  label: {
    maxWidth: "100%",
  },
});
