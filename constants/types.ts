import { ResizeMode } from "react-native-fast-image";

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
