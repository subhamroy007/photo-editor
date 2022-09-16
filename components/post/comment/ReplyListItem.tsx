import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectReplyItemParams } from "../../../api/post/postSelector";
import { globalStyles } from "../../../constants/style";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Avatar } from "../../utility/Avatar";
import { Icon } from "../../utility/Icon";
import { Label } from "../../utility/Label";
import { AppPressable } from "../../utility/AppPressable";
import { HighlightedText } from "../../utility/HighlightedText";

export type ReplyListItemProps = {
  postId: string;
  commentId: string;
  replyId: string;
  transparent?: boolean;
};

export const ReplyListItem = React.memo<ReplyListItemProps>(
  ({ replyId, commentId, postId, transparent }) => {
    const getReply = useCallback((state) => {
      return selectReplyItemParams(state, postId, commentId, replyId);
    }, []);

    const reply = useStoreSelector(getReply, shallowEqual);

    return (
      <View
        style={[
          globalStyles.borderBottomRadiusSize3,
          globalStyles.borderTopRadiusSize3,
          globalStyles.marginLeftSize9,
          globalStyles.marginBottomSize4,
        ]}
      >
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.paddingVerticalSize2,
            globalStyles.paddingHorizontalSize6,
            globalStyles.alignCenter,
          ]}
        >
          <Pressable android_disableSound>
            <Avatar
              hasRing={reply.author.hasUnseenStory}
              isActive={reply.author.hasUnseenStory}
              transparent={transparent}
              image={reply.author.profilePicture}
            />
          </Pressable>
          <Pressable
            android_disableSound
            style={[globalStyles.marginLeftSize4]}
          >
            <Label text={reply.author.userid} />
          </Pressable>
          <Label
            text={reply.timestamp}
            size="extra-small"
            type="info"
            style="regular"
            styleProp={{ marginLeft: "auto" }}
          />
        </View>
        <AppPressable
          style={[
            globalStyles.paddingHorizontalSize6,
            globalStyles.paddingVerticalSize1,
          ]}
        >
          <HighlightedText
            text={reply.content}
            gotoAccount={() => {}}
            gotoHashtag={() => {}}
          />
        </AppPressable>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignCenter,
            globalStyles.justifyAround,
            globalStyles.paddingVerticalSize4,
          ]}
        >
          <Pressable android_disableSound>
            <Icon name="more" size="extra-small" transparent={transparent} />
          </Pressable>
          <Pressable android_disableSound>
            <Icon name="comment" size="extra-small" transparent={transparent} />
          </Pressable>
          <Pressable android_disableSound>
            <Icon
              name="heart-outline"
              size="extra-small"
              transparent={transparent}
            />
          </Pressable>
        </View>
        {reply.noOfLikes > 0 && (
          <View
            style={[
              globalStyles.paddingHorizontalSize6,
              globalStyles.paddingVerticalSize2,
              globalStyles.flexRow,
              globalStyles.alignCenter,
            ]}
          >
            <Pressable
              android_disableSound
              style={globalStyles.marginRightSize4}
            >
              <Label text={reply.noOfLikes + " likes"} />
            </Pressable>
          </View>
        )}
      </View>
    );
  }
);
