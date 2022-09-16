import { NavigatorScreenParams } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { StoreDispatch, StoreRootState } from "../api/store";
import {
  TextureMagFilter,
  TextureMinFilter,
  TextureWrapType,
} from "../utility/webgl/Texture";

export type IconName =
  | "about"
  | "arrow-down"
  | "arrow-up"
  | "arrow-left"
  | "arrow-right"
  | "block"
  | "bookmark-outline"
  | "bookmark-solid"
  | "boomerang"
  | "burger"
  | "brush"
  | "camera-flip"
  | "camera-outline"
  | "camera-solid"
  | "caption-outline"
  | "caption-solid"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "clipboard"
  | "close"
  | "comment"
  | "create"
  | "download"
  | "draw"
  | "edit-outline"
  | "edit-solid"
  | "effect"
  | "emoji"
  | "eraser"
  | "expand"
  | "favourite"
  | "filter"
  | "finder"
  | "flash-off"
  | "flash-on"
  | "folder"
  | "follow"
  | "following"
  | "font"
  | "forward"
  | "grid"
  | "hashtag"
  | "heart-outline"
  | "heart-solid"
  | "help"
  | "hide"
  | "history"
  | "home-outline"
  | "home-solid"
  | "info"
  | "layout"
  | "layout-1"
  | "layout-2"
  | "layout-3"
  | "link"
  | "live"
  | "location"
  | "lock"
  | "maximize"
  | "memories"
  | "mention"
  | "message-outline"
  | "message-solid"
  | "mic-off"
  | "mic-on"
  | "minimize"
  | "moments-outline"
  | "moments-solid"
  | "more"
  | "multicapture"
  | "multiselect"
  | "music"
  | "mute"
  | "next"
  | "notification-outline"
  | "notification-solid"
  | "paperclip"
  | "pause"
  | "phone-outline"
  | "phone-solid"
  | "pin-solid"
  | "play"
  | "previous"
  | "report"
  | "retry"
  | "search-regular"
  | "search-solid"
  | "security"
  | "send"
  | "settings-outline"
  | "settings-solid"
  | "share"
  | "show"
  | "sticker"
  | "tag-regular"
  | "tag-solid"
  | "tick"
  | "timer"
  | "timer-15"
  | "timer-30"
  | "timer-60"
  | "trash"
  | "trending-outline"
  | "trending-solid"
  | "undo"
  | "upload"
  | "user-solid"
  | "user-solid"
  | "vibrance"
  | "video-outline"
  | "video-solid"
  | "video-recorder-outline"
  | "video-recorder-solid"
  | "volume-high"
  | "ellipses"
  | "account-outline"
  | "star";

export interface EffectParams {
  metadata: {
    target: "camera" | "media";
    activeOnRecord: boolean;
  };
  // medias: MediaParams[];
  textures: TextureParams[];
  materials: MaterialParams[];
  frames: FrameParams[];
}

export interface FrameParams {
  name: string;
  material: string;
  uv?: number[];
  scaleX?: Property;
  scaleY?: Property;
  scaleZ?: Property;
  rotationX?: Property;
  rotationY?: Property;
  rotationZ?: Property;
  translationX?: Property;
  translationY?: Property;
  translationZ?: Property;
}

export interface MaterialParams {
  name: string;
  texture: {
    target: string;
    overlay?: string;
  };
  colorMatrix: {
    brightness?: Property;
    contrast?: Property;
  };
}

export interface TextureParams {
  name: string;
  media: string;
  wrapX?: TextureWrapType;
  wrapY?: TextureWrapType;
  minFilter?: TextureMinFilter;
  magFilter?: TextureMagFilter;
}

export type Property = number | string | TransitionConfig;

export interface TransitionParams {
  to: number | string;
  duration: number;
  type: "jump" | "linear";
}

export interface TransitionConfig {
  transitions: TransitionParams[];
  repeat: boolean;
  initValue: number | string;
}

export interface TransitionProperty {
  inputRange: number[];
  outputRange: number[];
  typeRange: ("jump" | "linear")[];
  repeat: boolean;
}

export type EffectPlaceHolder = "$SCREEN_WIDTH" | "$SCREEN_HEIGHT";

export type LabelProps = {
  text: string;
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
  style?: "medium" | "bold" | "regular";
  gap?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  gapHorizontal?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  gapVertical?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  corner?: "small-round" | "large-round";
  alignment?: "end" | "start" | "center" | "stretch";
  background?: string;
  foreground?: string;
  styleProp?: StyleProp<TextStyle>;
  hasUnderline?: boolean;
  backgroundVisible?: boolean;
  borderVisible?: boolean;
  noOfLines?: number;
  onPress?: () => void;
  transparent?: boolean;
  type?: "primary" | "secondary" | "info";
  textAlign?: "center" | "left" | "right";
};

export type IconProps = {
  name: IconName;
  size?: "small" | "medium" | "large" | "extra-small" | "extra-large";
  type?: "primary" | "secondary" | "info";
  alignment?: "center" | "start" | "end";
  foreground?: string;
  transparent?: boolean;
  styleProp?: StyleProp<ImageStyle>;
};

export type RoundIconProps = {
  gap?: "small" | "medium" | "large";
  style?: "outline" | "solid";
  background?: string;
  styleProp?: StyleProp<ViewStyle>;
} & IconProps;

export type VideoParams = {
  duration: number;
  thumbnail: MediaParams;
  preview: { duration: number } & MaterialParams;
} & MediaParams;

export type LocalMediaParams = {
  timestamp: number;
  album: string;
} & VideoParams;

export type LocalMediaHookState = {
  albums: string[];
  media: LocalMediaParams[];
  isLoading: boolean;
  isError: boolean;
  hasReadPermission: boolean;
  hasWritePermission: boolean;
};

export type StoryResponse = {
  id: string;
  hasSeen: boolean;
  media: MediaParams;
};

export type ReplyResponse = {
  id: string;
  author: AccountResponse;
  timestamp: number;
  content: string;
  noOfLikes: number;
  isLiked: boolean;
};

export type CommentResponse = {
  noOfReplies: number;
  replies: ReplyResponse[];
  isPinned: boolean;
} & ReplyResponse;

export type ReplyItemParams = {
  id: string;
  author: {
    hasNewStory: boolean;
    hasUnseenStory: boolean;
    userid: string;
    profilePicture: MediaParams;
  };
  timestamp: string;
  content: string;
  noOfLikes: number;
  isLiked: boolean;
};

export type CommentItemParams = {
  noOfReplies: number;
  isPinned: boolean;
  replies: string[];
} & ReplyItemParams;

export type ReplyGlobalParams = {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  noOfLikes: number;
  isLiked: boolean;
};

export type CommentGlobalParams = {
  isPinned: boolean;
  noOfReplies: number;
  replies: ReplyGlobalParams[];
} & ReplyGlobalParams;

export type PostType = "photo" | "video" | "moment";

export type HashtagResponse = {
  name: string;
  noOfPosts: number;
};

export type LocationResponse = {
  name: string;
  noOfPosts: number;
};

export type AccountResponse = {
  userid: string;
  username: string;
  isFollowing: boolean;
  isFavourite: boolean;
  hasNewStory: boolean;
  profilePicture: {
    original: MediaParams;
    preview: MediaParams;
    encoded: string;
  } | null;
};

export type AudioResponse = {
  id: string;
  title: string;
  artist: string;
  startFrom: number;
  isSaved: boolean;
  uri: string;
  poster: MediaParams;
  isAvailable: boolean;
  noOfVideos: number;
};

export type FilterResponse = {
  id: string;
  name: string;
  isSaved: boolean;
  poster: MediaParams;
  noOfVideos: number;
  isAvailable: boolean;
};

export type PostResponse = {
  id: string;
  type: PostType;
  author: AccountResponse;
  thumbnail: { original: MediaParams; thumbnailEncoded: string };
  caption: string;
  location: string;
  accounts: AccountResponse[];
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfOpinions: number;
  video: {
    media: MediaParams;
    title: string;
    noOfAudience: number;
  } | null;
  moment: {
    media: MediaParams;
    audio: { id: string; name: string } | null;
    filter: { id: string; name: string } | null;
    noOfAudience: number;
  } | null;
  photos: {
    media: MediaParams[];
  } | null;
};

export type PostGlobalParams = {
  id: string;
  type: PostType;
  author: string;
  thumbnail: { original: MediaParams; thumbnailEncoded: string };
  caption: string;
  location: string;
  accounts: string[];
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfOpinions: number;
  video: {
    media: MediaParams;
    title: string;
    noOfAudience: number;
  } | null;
  moment: {
    media: MediaParams;
    audio: { id: string; name: string } | null;
    filter: { id: string; name: string } | null;
    noOfAudience: number;
  } | null;
  photos: {
    media: MediaParams[];
  } | null;
};

export type AccountGlobalParams = {
  stories: StoryResponse[];
} & AccountResponse;

export type CommonPostItemParams = {
  id: string;
  author: string;
  thumbnail: string;
  caption: string;
  location: string;
  account: string | number;
  timestamp: string;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfOpinions: number;
};

export type PostItemParams = CommonPostItemParams &
  (
    | {
        type: "photo";
        photos: MediaParams[];
      }
    | { type: "video"; video: MediaParams; title: string; noOfAudience: number }
    | {
        type: "moment";
        video: MediaParams;
        audio: { id: string; name: string } | null;
        filter: { id: string; name: string } | null;
        noOfAudience: number;
      }
  );

export type AccountItemParams = {
  userid: string;
  username: string;
  isFollowing: boolean;
  isFavourite: boolean;
  hasNewStory: boolean;
  hasUnseenStory: boolean;
  profilePicture: MediaParams;
  isUser: boolean;
};

export type MediaParams = {
  uri: string;
  width: number;
  height: number;
};

export type AppErrorParams = {
  code: number;
  message: string;
  reasons: {
    [key: string]: string;
  };
};

export type PostItemProps = {
  postId: string;
  isItemFocused: boolean;
  postType?: "following" | "suggested";
  contentHeight: number;
  hide?: boolean;
  togglePostHideState: (postId: string) => void;
};

export type MediaLoadingComponentProps = {
  poster: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

//navigator param types
export type HomeStacksParams = {
  HomeFeed: undefined;
  Favourites: undefined;
  Followings: undefined;
  Suggested: { type: PostType; firstPostId: string };
};

export type RootBottomTabNavigatorParams = {
  HomeStacks: NavigatorScreenParams<HomeStacksParams>;
  SuggestedTabs: undefined;
  Notification: undefined;
  Chat: undefined;
};

export type LikeParams =
  | { type: "post"; postId: string }
  | { type: "opinion"; postId: string; opinionId: string }
  | { type: "reply"; postId: string; opinionId: string; replyId: string };

export type RootStackNavigatorParams = {
  BottomTabs: NavigatorScreenParams<RootBottomTabNavigatorParams>;
  TempScreen: undefined;
  CreateContent: undefined;
  Chat: undefined;
  CloseToMe: undefined;
  Hashtag: { name: string };
  Location: { name: string };
  Audio: { id: string };
  Effect: { id: string };
  Account: { userid: string };
  Post: { id: string };
  Story: { userid: string };
  Likes: LikeParams;
};

export type AppThemeTypes = "light" | "dark";

export type LocalData = {
  defaultProfilePicture: MediaParams;
  profilePicture: MediaParams;
  logo: MediaParams;
  theme: AppThemeTypes;
  isSystemTheme: boolean;
  userid: string;
  accessToken: string;
  refreshToken: string;
  icons: {
    [key: string]: string;
  };
};

export type AppSliceState = {
  interactionId: number;
  unfollowedAccounts: string[];
  mutedAccounts: string[];
  mute: boolean;
} & LocalData;

export type RootStackScreenProps =
  NativeStackScreenProps<RootStackNavigatorParams>;

export type ErrorParams = {
  reason: string;
  msg: string;
  code: number;
};

export type AsyncThunkConfig = {
  state: StoreRootState;
  dispatch: StoreDispatch;
  extra?: unknown;
  rejectValue: ErrorParams;
  serializedErrorType: ErrorParams;
  pendingMeta?: unknown;
  fulfilledMeta: undefined;
  rejectedMeta?: unknown;
};

//screen props------------------------------------------>
export type AudioScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Audio"
>;

export type EffectScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Effect"
>;

export type LocationScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Location"
>;

export type HashtagScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Hashtag"
>;

export type AccountScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Account"
>;

export type LikesScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Likes"
>;

export type PostScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Post"
>;

export type StoryScreenProps = NativeStackScreenProps<
  RootStackNavigatorParams,
  "Story"
>;

//entity types:---------------------------------------
export type AccountShortResponse = {
  userid: string;
  username: string;
  profilePicture: MediaParams;
};
