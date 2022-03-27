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

export type Action =
  | {
      type: "photo_select/init";
      payload: {
        albums: PhotoAlbum[];
        photos: Photo[];
      };
    }
  | {
      type: "photo_select/select_deselect_photo";
      payload: {
        uri: string;
      };
    }
  | {
      type: "photo_select/switch_album";
      payload: {
        title: string;
        photos?: Photo[];
      };
    }
  | {
      type: "photo_select/add_photo";
      payload: {
        title: string;
        photos: Photo[];
      };
    };

export function reducer(
  state: PhotoSelectScreenState,
  action: Action
): PhotoSelectScreenState {
  let albumMap: PhotoSelectScreenState["albums"] = {};
  let photoMap: PhotoSelectScreenState["photos"] = {};
  let photo: Photo | null = null;
  let album: PhotoAlbum | null = null;

  switch (action.type) {
    case "photo_select/init":
      albumMap = {};
      action.payload.albums.forEach((album) => (albumMap[album.title] = album));
      photoMap = {};
      action.payload.photos.forEach((photo) => (photoMap[photo.uri] = photo));
      albumMap["Gallery"]!.photos = action.payload.photos.map(
        (photo) => photo.uri
      );
      return {
        ...state,
        selectedAlbumTitle: "Gallery",
        albums: albumMap,
        photos: photoMap,
      };
    case "photo_select/select_deselect_photo":
      photo = state.photos[action.payload.uri];
      if (!photo) {
        return state;
      }
      photo.isSelected = !photo.isSelected;
      let selectedPhotos = state.selectedPhotos;
      if (photo.isSelected) {
        selectedPhotos.push(photo.uri);
      } else {
        selectedPhotos = selectedPhotos.filter((uri) => uri !== photo!.uri);
      }
      return {
        ...state,
        photos: {
          ...state.photos,
          [photo.uri]: photo,
        },
        selectedPhotos,
      };
    case "photo_select/switch_album":
      if (!action.payload.photos) {
        return {
          ...state,
          selectedAlbumTitle: action.payload.title,
        };
      }
      photoMap = {};
      action.payload.photos.forEach((photo) => (photoMap[photo.uri] = photo));
      album = state.albums[action.payload.title];
      if (!album) {
        return state;
      }
      album.photos = action.payload.photos.map((photo) => photo.uri);
      return {
        ...state,
        selectedAlbumTitle: action.payload.title,
        photos: {
          ...state.photos,
          ...photoMap,
        },
        albums: {
          ...state.albums,
          [album.title]: album,
        },
      };
    case "photo_select/add_photo":
      photoMap = {};
      action.payload.photos.forEach((photo) => (photoMap[photo.uri] = photo));
      album = state.albums[action.payload.title];
      if (!album) {
        return state;
      }
      album.photos.push(...action.payload.photos.map((photo) => photo.uri));
      return {
        ...state,
        albums: {
          ...state.albums,
          [album.title]: album,
        },
        photos: {
          ...state.photos,
          ...photoMap,
        },
      };
  }
}
