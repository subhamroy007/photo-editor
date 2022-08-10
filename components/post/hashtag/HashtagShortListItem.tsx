import React from "react";
import { View } from "react-native";
import { COLOR_5 } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { HashtagResponse } from "../../../constants/types";
import { getCountString } from "../../../constants/utility";
import { AppIcon } from "../../utility/AppIcon";
import { AppLabel } from "../../utility/AppLabel";
import { AppPressable } from "../../utility/AppPressable";

export type HashtagShortListItemProps = {
  hashtag: HashtagResponse;
  onSelect: () => void;
};

export const HashtagShortListItem = React.memo<HashtagShortListItemProps>(
  (props) => {
    const { hashtag, onSelect } = props;

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
        <AppIcon name="hashtag" borderVisible gap="medium" size="small" />
        <View
          style={[
            globalStyles.marginLeftSize4,
            globalStyles.alignStart,
            globalStyles.justifyCenter,
            globalStyles.flex1,
          ]}
        >
          <AppLabel text={hashtag.hashtag} styleProp={{ maxWidth: "100%" }} />
          <AppLabel
            text={getCountString(hashtag.noOfPosts)}
            styleProp={[{ maxWidth: "100%" }, globalStyles.marginTopSize2]}
            foreground={COLOR_5}
          />
        </View>
      </AppPressable>
    );
  },
  () => true
);
