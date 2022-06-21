import { NavigatorScreenParams } from "@react-navigation/native";
import { vec3 } from "gl-matrix";
import { ReactNode } from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { ResizeMode } from "react-native-fast-image";
import { ComposedGesture } from "react-native-gesture-handler";
import { Gesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/gesture";
import { SharedValue } from "react-native-reanimated";
import { SceneRendererProps } from "react-native-tab-view";
import {
  TextureMagFilter,
  TextureMinFilter,
  TextureWrapType,
} from "../utility/webgl/Texture";

export interface PhotoRenderConfig {
  width: number;
  height: number;
  resizeMode: ResizeMode;
}

export interface PhotoAlbum {
  title: string;
  count: number;
  endCursor: number;
  hasNextPage: boolean;
  photos: string[];
}

export interface Photo {
  uri: string;
  timestamp: number;
  width: number;
  height: number;
  isSelected: boolean;
}

export interface PhotoSelectScreenState {
  albums: {
    [key: string]: PhotoAlbum | null;
  };
  photos: {
    [key: string]: Photo | null;
  };
  selectedAlbumTitle: string;
  selectedPhotos: string[];
}

export interface PhotoFetchResult {
  photos: Photo[];
  endCursor: number;
  hasNextPage: boolean;
}

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

export interface MediaOptions {
  name: string;
  localUri: string;
  width: number;
  height: number;
  duration: number;
  frame: number;
  type: "photo" | "video";
}

export interface MediaState {
  loaded: boolean;
  error: boolean;
  mediaMap: {
    [key: string]: MediaOptions;
  };
}

export interface EffectInfo {
  id: string;
  name: string;
  avatarUri: string;
}

export interface MusicInfo {
  id: string;
  title: string;
  artist: string;
  noOfVideos: number;
  uri: string;
  isBookmarked: boolean;
  posterUri: string;
  duration: number;
}

export type EffectTabProps = {
  onEffectSelect: (id: string) => void;
} & SceneRendererProps;

export type MusicTabProps = MusicTabParams & SceneRendererProps;

export type MusicTabParams = {
  onMusicSelect: (music: MusicInfo) => void;
};

export interface EffectTabState {
  effects: EffectInfo[];
  isLoading: boolean;
  hasError: boolean;
}

export type ContentType = "PHOTO" | "VIDEO" | "STORY" | "SHORTS";

export type Resolution = {
  width: number;
  height: number;
};

export type ImageContainerConfig = {
  resizeMode: "cover" | "contain" | "center";
} & Resolution;

export type AppLabelProps = {
  text: string;
  size?: "small" | "medium" | "large" | "extra-large" | "extra-small";
  style?: "medium" | "bold" | "regular";
  gap?: "small" | "large";
  corner?: "small-round" | "large-round";
  background?: string;
  foreground?: string;
  styleProp?: StyleProp<TextStyle>;
  hasUnderline?: boolean;
  isBackgroundVisible?: boolean;
  isBorderVisible?: boolean;
  noOfLines?: number;
  onPress?: () => void;
};

export type AppIconProps = {
  name: IconName;
  size?: "small" | "medium" | "large" | "extra-small" | "extra-large";
  gap?: "small" | "large" | "none";
  background?: string;
  foreground?: string;
  styleProp?: StyleProp<TextStyle>;
  isBackgroundVisible?: boolean;
  isBorderVisible?: boolean;
  onPress?: () => void;
};

export type AppPressableProps = {
  children?: ReactNode;
  styleProp?: StyleProp<ViewStyle>;
  isAnimated?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  activeOverlayColor?: string;
};

export type AppContainerProps = {
  isBottomSafe?: boolean;
  isTopSafe?: boolean;
  isLeftSafe?: boolean;
  isRightSafe?: boolean;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  stretchToFill?: boolean;
  selfAlignment?: "stretch" | "center" | "start" | "end";
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  borderColor?: string;
  borderWidth?: number;
  borderBottomWidth?: number;
  borderTopWidth?: number;
  borderRadius?: number;
  borderTopRadius?: number;
  borderBottomRadius?: number;
  wrapContent?: boolean;
  contentOrientation?: "row" | "column";
  majorAxisAlignment?:
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly";
  minorAxisAlignment?: "start" | "end" | "center" | "stretch";
  contentAlignment?:
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "stretch";
  styleProp?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export type ImageParams = {
  uri: string;
  width: number;
  height: number;
};

export type VideoParams = {
  duration: number;
  thumbnail: ImageParams;
  preview: { duration: number } & ImageParams;
} & ImageParams;

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

export type AccountShortResponse = {
  id: string;
  userId: string;
  username: string;
  isFollower: boolean;
  isFollowing: boolean;
  hasUnseenStory: boolean;
  profilePictureUri: string;
};

export type LocationShortResponse = {
  id: string;
  name: string;
  title: string;
};

export type CommentResponse = {
  id: string;
  content: string;
  author: AccountShortResponse;
  timestamp: number;
  hasLiked: boolean;
  noOkLikes: number;
  noOfReplies: number;
};

export type AudioShortResponse = {
  id: string;
  title: string;
  artist: string;
  startFrom: number;
  isAvailable: boolean;
  isSaved: boolean;
  uri: string;
  poster: string;
  duration: number;
};

export type EffectShortResponse = {
  id: string;
  poster: string;
  title: string;
  isSaved: boolean;
};

export type PostResponse = {
  type: "photo" | "video" | "shorts";
  id: string;
  author: AccountShortResponse;
  media: MediaParams[];
  audio: AudioShortResponse | null;
  poster: string;
  duration: number;
  caption: string;
  title: string;
  taggedLocation: LocationShortResponse | null;
  taggedAccounts: AccountShortResponse[];
  effect: EffectShortResponse | null;
  timestamp: number;
  isSaved: boolean;
  isLiked: boolean;
  isWatched: boolean;
  noOfLikes: number;
  noOfViews: number;
  noOfComments: number;
  topComments: CommentResponse[];
  topLikes: AccountShortResponse[];
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

export type FeedPostProps = {
  post: PostResponse;
  onFollowButtonPress: (index: number) => void;
  onMoreIconPress: (index: number) => void;
  onLikePress: (index: number, value?: boolean) => void;
  onCommentPress: (index: number) => void;
  onAuthorIdPress: (index: number) => void;
  onAuthorAvatarPress: (index: number) => void;
  onSharePress: (index: number) => void;
  onBookmarkPress: (index: number) => void;
  onLocationPress: (index: number) => void;
  onTagIconPress: (index: number) => void;
  onMusicButtonPress: (index: number) => void;
  onEffectButtonPress: (index: number) => void;
  onLikeCountPress: (index: number) => void;
  onHashtagPress: (hashtag: string) => void;
  onAccountPress: (userId: string) => void;
  notify: (notification: string) => void;
  showFollowButton: boolean;
  isVisible: boolean;
  index: number;
  width: number;
  isStoryLoading: boolean;
};

export type FeedVideoPostProps = {
  isMuted: boolean;
  toggleMuteState: () => void;
} & FeedPostProps;

export type FeedShortsPostProps = {
  isMuted: boolean;
  toggleMuteState: () => void;
} & FeedPostProps;

export type FeedPostTemplateProps = {
  height: number;
  children: ReactNode;
  loadAsync: () => Promise<void>;
  onLoad: () => void;
} & FeedPostProps;

export type FullScreenPostProps = {
  height: number;
  toggleFullScreen: (orientation: "landscape" | "portrait") => void;
  isFullScreen: boolean;
} & FeedPostProps;

export type FullScreenImagePostProps = {
  initialIndex: number;
} & FullScreenPostProps;

export type FullScreenShortsPostProps = {
  startFrom: number;
  isMuted: boolean;
  toggleMuteState: () => void;
} & FullScreenPostProps;

export type FullScreenVideoPostProps = {
  startFrom: number;
  isMuted: boolean;

  toggleMuteState: () => void;
} & FullScreenPostProps;

export type FullScreenPostTemplateProps = {
  hideDetails: boolean;
  externalGesture: ComposedGesture;
  loadMedia: () => Promise<void>;
  onLoad: () => void;
  height: number;
  children: ReactNode;
  isReady: boolean;
  topNode: ReactNode;
} & FullScreenPostProps;

export type MediaLoadingIndicatorProps = {
  loadMedia: () => Promise<void>;
  onLoad: () => void;
  onError: (error: AppErrorParams) => void;
  posterUri: string;
};

export type AppGestureComponentProps = {
  disabled?: boolean;
  onTap: () => void;
  onDoubleTap: () => void;
  onLongPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export type MediaRenderingComponentProps = {
  poster: string;
  loadAsync: () => Promise<void>;
  onLoad: () => void;
  onError: () => void;
  type: "post" | "account";
  width: number;
  height: number;
} & AppGestureComponentProps;

export type AppImageProps = {
  media: MediaParams;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  disableZoom?: boolean;
  onPinchStart?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  scrollStart?: number;
  scrollEnd?: number;
  offset?: SharedValue<number>;
};

export type AppImageListProps = {
  media: MediaParams[];
  width: number;
  height: number;
  onIndexChange?: (index: number) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  initialIndex?: number;
  disableZoom?: boolean;
  onPinchStart?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
};

//navigator param types
export type UtilityStackNavigatorParams = {
  Profile: {
    userId: string;
  };
};

export type RootBottomTabNavigatorParams = {
  UtilityStacks: NavigatorScreenParams<UtilityStackNavigatorParams>;
  HomeFeed: undefined;
  VideoFeed: undefined;
  ShortsFeed: undefined;
  Notification: undefined;
  Account: undefined;
};

export type RootMaterialTopTabNavigatorParams = {
  BottomTabs: NavigatorScreenParams<RootBottomTabNavigatorParams>;
  CreateContent: undefined;
  Chat: undefined;
};

export type RootStackNavigatorParams = {
  MaterialTopTabs: NavigatorScreenParams<RootMaterialTopTabNavigatorParams>;
  TempScreen: undefined;
};
