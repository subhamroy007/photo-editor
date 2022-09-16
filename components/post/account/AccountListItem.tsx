import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectAccountItem } from "../../../api/accounts/accountSelector";
import { toggleAccountFollowing } from "../../../api/accounts/accountSlice";
import { selectAccountId } from "../../../api/global/appSelector";
import { globalStyles } from "../../../constants/style";
import { useStoreDispatch } from "../../../hooks/useStoreDispatch";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Avatar } from "../../utility/Avatar";
import { Label } from "../../utility/Label";
import { AppPressable } from "../../utility/AppPressable";

export type AccountListItemProps = {
  id: string;
  gotoAccount: (userid: string) => void;
  transparent?: boolean;
};

export const AccountListItem = React.memo<AccountListItemProps>(
  (props) => {
    const { id, transparent, gotoAccount } = props;

    const getAccount = useCallback(
      (state) => selectAccountItem(state, id),
      [id]
    );

    const account = useStoreSelector(getAccount, shallowEqual);

    const defaultUserid = useStoreSelector(selectAccountId);

    const dispatch = useStoreDispatch();

    const onFollowButtonPress = useCallback(() => {
      dispatch(toggleAccountFollowing(id));
    }, [id, dispatch]);

    const onAvatarPress = useCallback(() => {
      console.log("avatar pressed");
    }, []);

    return (
      <AppPressable
        onPress={() => gotoAccount(account.userid)}
        style={[
          globalStyles.flexRow,
          globalStyles.paddingVerticalSize2,
          globalStyles.paddingHorizontalSize4,
          globalStyles.alignCenter,
        ]}
      >
        <Pressable android_disableSound onPress={onAvatarPress}>
          <Avatar
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
          <Label
            text={account.userid}
            alignment="left"
            transparent={transparent}
          />
          <Label
            text={account.username}
            type="info"
            transparent={transparent}
            alignment="left"
            styleProp={globalStyles.marginTopSize2}
          />
        </View>
        {defaultUserid !== account.userid && (
          <Pressable
            style={[globalStyles.marginLeftSize4, globalStyles.flex1]}
            onPress={onFollowButtonPress}
          >
            <Label
              text={account.isFollowing ? "following" : "follow"}
              backgroundVisible={!account.isFollowing}
              borderVisible={account.isFollowing}
              style="bold"
              gapVertical="medium"
              corner="small-round"
              transparent={transparent}
            />
          </Pressable>
        )}
      </AppPressable>
    );
  },
  () => {
    return true;
  }
);
