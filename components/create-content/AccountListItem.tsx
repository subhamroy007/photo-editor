import React from "react";
import { SIZE_4, SIZE_5, SIZE_7 } from "../../constants/constants";
import { AccountShortResponse } from "../../constants/types";
import { AppAvatar } from "../utility/AppAvatar";
import { AppContainer } from "../utility/AppContainer";
import { AppLabel } from "../utility/AppLabel";

export type AccountListItemProps = {
  onPress: () => void;
} & AccountShortResponse;

export const AccountListItem = React.memo<AccountListItemProps>(
  ({ hasUnseenStory, onPress, profilePicture, userId, username }) => {
    return (
      <AppContainer
        selfAlignment="stretch"
        paddingBottom={SIZE_4}
        paddingLeft={SIZE_5}
        paddingRight={SIZE_5}
        paddingTop={SIZE_4}
        contentOrientation="row"
        onPress={onPress}
      >
        <AppAvatar
          {...profilePicture}
          hasRing={hasUnseenStory}
          size="medium"
          type="active"
        />
        <AppContainer
          selfAlignment="stretch"
          styleProp={{ marginLeft: SIZE_5 }}
          stretchToFill={true}
          minorAxisAlignment="start"
        >
          <AppLabel text={userId} foreground="#1f1f1f" />
          <AppLabel
            text={username}
            foreground="grey"
            size="small"
            styleProp={{ marginTop: SIZE_7 }}
          />
        </AppContainer>
      </AppContainer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id && prevProps.onPress === nextProps.onPress
    );
  }
);
