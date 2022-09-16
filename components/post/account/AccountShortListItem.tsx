import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { globalStyles } from "../../../constants/style";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Avatar } from "../../utility/Avatar";
import { Label } from "../../utility/Label";
import { AppPressable } from "../../utility/AppPressable";
import { AccountShortResponse } from "../../../constants/types";

export type AccountShortListItemProps = {
  onSelect: (userid: string) => void;
  transparent?: boolean;
} & AccountShortResponse;

export const AccountShortListItem = React.memo<AccountShortListItemProps>(
  ({ onSelect, transparent, profilePicture, userid, username }) => {
    const onPress = useCallback(() => {
      onSelect(userid);
    }, []);

    return (
      <AppPressable
        transparent={transparent}
        onPress={onPress}
        type="underlay"
        style={[
          globalStyles.paddingHorizontalSize4,
          globalStyles.paddingVerticalSize3,
          globalStyles.alignCenter,
          globalStyles.flexRow,
        ]}
      >
        <Avatar
          image={profilePicture}
          transparent={transparent}
          size="medium"
        />
        <View style={[globalStyles.marginLeftSize4, globalStyles.alignStart]}>
          <Label text={userid} transparent={transparent} />
          <Label
            text={username}
            transparent={transparent}
            type="info"
            styleProp={globalStyles.marginTopSize1}
          />
        </View>
      </AppPressable>
    );
  },
  () => true
);

const styles = StyleSheet.create({
  maxWidth: {
    maxWidth: "75%",
  },
});
