import React from "react";
import { View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectProfilePicuture } from "../../../api/global/appSelector";
import { COLOR_5 } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountResponse } from "../../../constants/types";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { AppAvatar } from "../../utility/AppAvatar";
import { AppLabel } from "../../utility/AppLabel";
import { AppPressable } from "../../utility/AppPressable";

export type AccountShortListItemProps = {
  account: AccountResponse;
  onSelect: () => void;
};

export const AccountShortListItem = React.memo<AccountShortListItemProps>(
  (props) => {
    const profilePicture = useStoreSelector(
      selectProfilePicuture,
      shallowEqual
    );

    const { account, onSelect } = props;

    return (
      <AppPressable
        type="underlay"
        style={[
          globalStyles.flexRow,
          globalStyles.paddingVerticalSize2,
          globalStyles.paddingHorizontalSize4,
        ]}
        onPress={onSelect}
      >
        <AppAvatar
          image={
            account.profilePicture
              ? account.profilePicture.small
              : profilePicture
          }
          size="medium"
        />
        <View
          style={[
            globalStyles.marginLeftSize4,
            globalStyles.alignStart,
            globalStyles.justifyCenter,
            globalStyles.flex1,
          ]}
        >
          <AppLabel text={account.userid} styleProp={{ maxWidth: "100%" }} />
          <AppLabel
            text={account.username}
            styleProp={[{ maxWidth: "100%" }, globalStyles.marginTopSize2]}
            foreground={COLOR_5}
          />
        </View>
      </AppPressable>
    );
  },
  () => true
);
