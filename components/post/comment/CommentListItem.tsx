import React, { useCallback } from "react";
import { Pressable, View } from "react-native";
import { shallowEqual } from "react-redux";
import { selectCommentItemParams } from "../../../api/post/postSelector";
import { globalStyles } from "../../../constants/style";
import { useStoreSelector } from "../../../hooks/useStoreSelector";
import { Avatar } from "../../utility/Avatar";
import { Icon } from "../../utility/Icon";
import { Label } from "../../utility/Label";
import { AppPressable } from "../../utility/AppPressable";
import { HighlightedText } from "../../utility/HighlightedText";
import { ReplyListItem } from "./ReplyListItem";

export type CommentListItemProps = {
  postId: string;
  commentId: string;
  transparent?: boolean;
};

export const CommentListItem = React.memo<CommentListItemProps>(
  ({ commentId, postId, transparent }) => {
    const getComment = useCallback((state) => {
      return selectCommentItemParams(state, postId, commentId);
    }, []);

    const comment = useStoreSelector(getComment, shallowEqual);

    return (
      <View>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.paddingVerticalSize2,
            globalStyles.paddingHorizontalSize4,
            globalStyles.alignCenter,
          ]}
        >
          <Pressable android_disableSound>
            <Avatar
              hasRing={comment.author.hasUnseenStory}
              isActive={comment.author.hasUnseenStory}
              size="medium"
              transparent={transparent}
              image={comment.author.profilePicture}
            />
          </Pressable>
          <Pressable
            android_disableSound
            style={[globalStyles.marginLeftSize4]}
          >
            <Label text={comment.author.userid} />
          </Pressable>
          <Pressable android_disableSound style={{ marginLeft: "auto" }}>
            <Icon name="ellipses" size="small" />
          </Pressable>
        </View>
        <HighlightedText
          style={[
            globalStyles.paddingHorizontalSize4,
            globalStyles.paddingVerticalSize1,
          ]}
          text={comment.content}
          gotoAccount={() => {}}
          gotoHashtag={() => {}}
        />
        <View
          style={[
            globalStyles.paddingHorizontalSize4,
            globalStyles.paddingVerticalSize2,
            globalStyles.flexRow,
            globalStyles.alignCenter,
            globalStyles.justifyEven,
          ]}
        >
          <Pressable android_disableSound>
            <Icon name="comment" size="small" transparent={transparent} />
          </Pressable>
          <Pressable android_disableSound>
            <Icon name="heart-outline" size="small" transparent={transparent} />
          </Pressable>
        </View>
        <View
          style={[
            globalStyles.paddingHorizontalSize4,
            globalStyles.paddingVerticalSize2,
            globalStyles.flexRow,
            globalStyles.alignCenter,
          ]}
        >
          <Label
            text={comment.timestamp}
            size="extra-small"
            type="info"
            style="regular"
            styleProp={globalStyles.marginRightSize4}
          />
          {comment.noOfLikes > 0 && (
            <Pressable
              android_disableSound
              style={globalStyles.marginRightSize4}
            >
              <Label
                text={comment.noOfLikes + " likes"}
                type="info"
                size="extra-small"
              />
            </Pressable>
          )}
          {comment.noOfReplies > 0 && (
            <Pressable android_disableSound>
              <Label
                text={comment.noOfReplies + " replies"}
                type="info"
                size="extra-small"
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  }
);
