import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ResizeMode } from "react-native-fast-image";
import { ComposedGesture } from "react-native-gesture-handler";
import { SceneRendererProps } from "react-native-tab-view";
import {
  TextureMagFilter,
  TextureMinFilter,
  TextureWrapType,
} from "../utility/webgl/Texture";

export type IconName =
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "clarity"
  | "close"
  | "comment-outline"
  | "comment-solid"
  | "contrast"
  | "create"
  | "dehaze"
  | "doodle"
  | "download"
  | "edge-brush"
  | "edit-outline"
  | "edit-solid"
  | "equalizer"
  | "eraser"
  | "expand"
  | "exposure"
  | "extra-thin-brush"
  | "favourite"
  | "fill"
  | "filter"
  | "flash-off"
  | "flash-on"
  | "folder"
  | "follow"
  | "following"
  | "font"
  | "gif"
  | "glamour"
  | "grain"
  | "grid"
  | "group-outline"
  | "group-solid"
  | "hashtag"
  | "heart-outline"
  | "heart-solid"
  | "help"
  | "hide"
  | "highlight"
  | "history"
  | "home-outline"
  | "home-solid"
  | "hue"
  | "info"
  | "layout"
  | "layout-1"
  | "layout-2"
  | "layout-3"
  | "live"
  | "location"
  | "lock"
  | "maximize"
  | "mention"
  | "message-outline"
  | "message-solid"
  | "mic-off"
  | "mic-on"
  | "minimize"
  | "moon"
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
  | "pin-outline"
  | "pin-solid"
  | "play"
  | "previous"
  | "report"
  | "saturation"
  | "search-bold"
  | "search-regular"
  | "send"
  | "security"
  | "settings-outline"
  | "settings-solid"
  | "share-outline"
  | "share-solid"
  | "sharp"
  | "shinny"
  | "shorts"
  | "show"
  | "smiley"
  | "spinner"
  | "sticker"
  | "sun"
  | "tag-regular"
  | "temperature"
  | "tag-bold"
  | "thin-brush"
  | "tick"
  | "timer-15"
  | "timer-30"
  | "timer-60"
  | "tint"
  | "tone"
  | "trash"
  | "trending-outline"
  | "trending-solid"
  | "undo"
  | "user-outline"
  | "user-solid"
  | "vibrance"
  | "video-outline"
  | "video-recorder-outline"
  | "video-recorder-solid"
  | "video-solid"
  | "vignette"
  | "volume-high"
  | "volume-low"
  | "volume-medium"
  | "white"
  | "about"
  | "added-to-playlist"
  | "add-song"
  | "add-to-playlist"
  | "around-the-clock"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up"
  | "bookmark-outline"
  | "bookmark-solid"
  | "boomerang"
  | "camera-flip"
  | "camera-outline"
  | "camera-solid"
  | "caption-outline"
  | "caption-solid"
  | "chevron-down";

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

export type AppLabelProps = {
  text: string;
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
  style?: "medium" | "bold" | "regular";
  gap?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  gapHorizontal?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  gapVertical?: "extra-small" | "small" | "large" | "medium" | "extra-large";
  corner?: "small-round" | "large-round";
  alignment?: "left" | "right" | "center";
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
};

export type AppIconProps = {
  name: IconName;
  size?: "small" | "medium" | "large" | "extra-small" | "extra-large";
  gap?: "small" | "medium" | "large" | "none";
  background?: string;
  foreground?: string;
  styleProp?: StyleProp<TextStyle>;
  backgroundVisible?: boolean;
  borderVisible?: boolean;
  onPress?: () => void;
  transparent?: boolean;
  type?: "primary" | "secondary" | "info";
};

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
} & ReplyResponse;

export type ReplyGlobalParams = {
  id: string;
  author: string;
  timestamp: number;
  content: string;
  noOfLikes: number;
  isLiked: boolean;
};

export type CommentGlobalParams = {
  noOfReplies: number;
  replies: ReplyResponse[];
} & ReplyGlobalParams;

export type PostCategory = "food" | "entertainment" | "music" | "others";

export type PostType = "photo" | "video" | "moment";

export type HashtagResponse = {
  id: string;
  name: string;
  noOfPosts: number;
};

export type AccountResponse = {
  id: string;
  userid: string;
  username: string;
  isFollowing: boolean;
  isFavourite: boolean;
  hasNewStory: boolean;
  noOfFollowers: number;
  profilePicture: {
    original: MediaParams;
    preview: MediaParams;
    previewEncoded: string;
  } | null;
  stories: StoryResponse[];
};

export type LocationResponse = {
  id: string;
  name: string;
  noOfPosts: number;
};

export type AudioResponse = {
  id: string;
  title: string;
  artist: string;
  startFrom: number;
  isSaved: boolean;
  uri: string;
  poster: MediaParams;
  duration: number;
  isAvailable: boolean;
  noOfVideos: number;
};

export type FilterResponse = {
  id: string;
  name: string;
  isSaved: boolean;
  poster: MediaParams;
  noOfVideos: number;
};

export type PostResponse = {
  id: string;
  type: PostType;
  category: PostCategory;
  author: AccountResponse;
  preview: MediaParams;
  previewEncoded: string;
  caption: string;
  location: LocationResponse | null;
  accounts: AccountResponse[];
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
  likes: AccountResponse[];
  comments: CommentResponse[];
  photo: {
    photos: MediaParams[];
  } | null;
  video: {
    video: MediaParams;
    duration: number;
    title: string;
  } | null;
  moment: {
    video: MediaParams;
    audio: AudioResponse | null;
    filter: FilterResponse | null;
  } | null;
};

export type PostGlobalParams = {
  id: string;
  type: PostType;
  category: PostCategory;
  author: string;
  preview: MediaParams;
  previewEncoded: string;
  caption: string;
  location: LocationResponse | null;
  accounts: string[];
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
  likes: string[];
  comments: CommentGlobalParams[];
  photo: {
    photos: MediaParams[];
  } | null;
  video: {
    video: MediaParams;
    duration: number;
    title: string;
  } | null;
  moment: {
    video: MediaParams;
    audio: string;
    filter: string;
  } | null;
};

export type PostItemParams = {
  id: string;
  type: PostType;
  category: PostCategory;
  author: {
    userid: string;
    profilePicture: MediaParams;
    showStoryIndicator: boolean;
    isFollowing: boolean;
    isFavourite: boolean;
    id: string;
  };
  previewEncoded: string;
  caption: string;
  location: string;
  accounts: string | number;
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
  likes: { profilePicture: MediaParams; userid: string }[];
  comments: { id: string; content: string; author: string }[];
  photo: {
    photos: MediaParams[];
  } | null;
  video: {
    video: MediaParams;
    duration: number;
    title: string;
  } | null;
  moment: {
    video: MediaParams;
    audio: { id: string; title: string; poster: MediaParams } | null;
    filter: { id: string; name: string } | null;
  } | null;
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
  openMoreOptionModal: (postId: string) => void;
  openCommentsShutter: (postId: string) => void;
  openLikesShutter: (postId: string) => void;
  openTagsShuttrer: (postId: string) => void;
  openShareShutter: (postId: string) => void;
};

export type MediaLoadingComponentProps = {
  poster: string;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

//navigator param types
export type UtilityStackNavigatorParams = {
  Profile: {
    userid: string;
  };
  Hashtag: {
    hashtag: string;
  };
  Location: {
    locationId: string;
  };
  Audio: {
    audioId: string;
  };
  Effect: {
    effectId: string;
  };
  Settings: undefined;
  Saved: undefined;
  Favourites: undefined;
};

export type RootBottomTabNavigatorParams = {
  UtilityStacks: NavigatorScreenParams<UtilityStackNavigatorParams>;
  HomeFeed: undefined;
  VideoFeed: undefined;
  ShortsFeed: undefined;
  Notification: undefined;
  Account: undefined;
};

export type RootStackNavigatorParams = {
  BottomTabs: NavigatorScreenParams<RootBottomTabNavigatorParams>;
  TempScreen: undefined;
  CreateContent: undefined;
  Chat: undefined;
  CloseToMe: undefined;
  LikesScreen: {
    id: string;
    type: "post" | "comment" | "reply";
  };
};

export type AppThemeTypes = "light" | "dark";

export type AppSliceState = {
  isMuted: boolean;
  defaultProfilePicture: MediaParams;
  profilePicture: MediaParams;
  logo: MediaParams;
  isFullScreenActive: boolean;
  theme: AppThemeTypes;
  isSystemTheme: boolean;
  userid: string;
  accessToken: string;
  refreshToken: string;
};

export type RootBotttomTabsNavigationProp = NativeStackNavigationProp<
  RootStackNavigatorParams,
  "BottomTabs"
>;
