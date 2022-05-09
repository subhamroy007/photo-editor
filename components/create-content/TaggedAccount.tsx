import React from "react";
import { SIZE_4, SIZE_5, SIZE_7 } from "../../constants/constants";
import { AccountShortResponse } from "../../constants/types";
import { AppAvatar } from "../utility/AppAvatar";
import { AppContainer } from "../utility/AppContainer";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";

export type TaggedAccountProps = {
  onPress: () => void;
} & AccountShortResponse;

export const TaggedAccount = React.memo<TaggedAccountProps>(
  ({ onPress, profilePicture, userId, username }) => {
    return (
      <AppContainer
        selfAlignment="stretch"
        paddingBottom={SIZE_4}
        paddingLeft={SIZE_5}
        paddingRight={SIZE_5}
        paddingTop={SIZE_4}
        contentOrientation="row"
      >
        <AppAvatar {...profilePicture} size="medium" />
        <AppContainer
          selfAlignment="stretch"
          styleProp={{ marginHorizontal: SIZE_4 }}
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
        <AppIcon
          name="cross"
          size="small"
          foreground="#1f1f1f"
          onPress={onPress}
        />
      </AppContainer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id && prevProps.onPress === nextProps.onPress
    );
  }
);
