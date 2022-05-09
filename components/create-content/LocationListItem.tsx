import React from "react";
import { SIZE_4, SIZE_5, SIZE_7 } from "../../constants/constants";
import { LocationShortResponse } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppIcon } from "../utility/AppIcon";
import { AppLabel } from "../utility/AppLabel";

export type LocationListItemProps = {
  onPress: () => void;
} & LocationShortResponse;

export const LocationListItem = React.memo<LocationListItemProps>(
  ({ name, onPress, title }) => {
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
        <AppIcon
          name="shorts"
          size="medium"
          type="outline"
          foreground="#1f1f1f"
          borderSize="small"
        />
        <AppContainer
          selfAlignment="stretch"
          styleProp={{ marginLeft: SIZE_5 }}
          stretchToFill={true}
          minorAxisAlignment="start"
        >
          <AppLabel text={title} foreground="#1f1f1f" />
          <AppLabel
            text={name}
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
