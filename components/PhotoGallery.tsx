import { BlurView } from "@react-native-community/blur";
import { useBackHandler } from "@react-native-community/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/constants";
import { getImageConfig } from "../constants/helper";

export interface PhotoInfo {
  uri: string;
  width: number;
  height: number;
}

export interface PhotoGalleryProps {
  photos: PhotoInfo[];
  initIndex: number;
  onClose: () => void;
}

export interface PhotoGalleryState {
  selectedIndex: number;
}

export interface PhotoGalleryReferences {
  bottomList: FlatList | null;
  topList: FlatList | null;
  // scrollOffset: Animated.Value;
  masterList: "top" | "bottom";
}

export interface PhotoGalleryBottomItemProps {
  uri: string;
  index: number;
  isFocused: boolean;
  onSelect: (index: number) => void;
}

export function PhotoGalleryBottomItem({
  uri,
  index,
  isFocused,
  onSelect,
}: PhotoGalleryBottomItemProps) {
  const onPress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: SCREEN_WIDTH / 4,
        height: SCREEN_WIDTH / 4,
        borderRadius: 16,
        borderColor: "white",
        borderWidth: isFocused ? 2 : 0,
        padding: isFocused ? 4 : 0,
      }}
    >
      <FastImage
        source={{ uri, cache: "immutable", priority: "high" }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
        }}
        resizeMode="cover"
      />
    </Pressable>
  );
}

export interface PhotoGalleryTopItemProps {
  photo: PhotoInfo;
  // animatedValue: Animated.Value;
  index: number;
}

export function PhotoGalleryTopItem({
  photo,
  // animatedValue,
  index,
}: PhotoGalleryTopItemProps) {
  const { height, resizeMode, width } = getImageConfig(
    SCREEN_WIDTH * 0.85,
    0,
    photo.width,
    SCREEN_HEIGHT * 0.64,
    0,
    photo.height
  );

  return (
    <Animated.View
      style={{
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        alignItems: "center",
        justifyContent: "center",
        // transform: [
        //   {
        //     scale: animatedValue.interpolate({
        //       inputRange: [
        //         (index - 1) * SCREEN_WIDTH,
        //         index * SCREEN_WIDTH,
        //         (index + 1) * SCREEN_WIDTH,
        //       ],
        //       outputRange: [0.8, 1.0, 0.8],
        //       extrapolate: "clamp",
        //     }),
        //   },
        // ],
      }}
    >
      <FastImage
        source={{ uri: photo.uri, cache: "immutable", priority: "high" }}
        resizeMode={resizeMode}
        style={{
          backgroundColor: "transparent",
          width,
          height,
          marginBottom: 100,
        }}
      />
    </Animated.View>
  );
}

export function PhotoGallery({
  photos,
  initIndex,
  onClose,
}: PhotoGalleryProps) {
  const [state, setState] = useState<PhotoGalleryState>({
    selectedIndex: initIndex,
  });

  useBackHandler(() => {
    onClose();
    return true;
  });

  const references = useRef<PhotoGalleryReferences>({
    bottomList: null,
    topList: null,
    // scrollOffset: new Animated.Value(0),
    masterList: "bottom",
  });

  useEffect(() => {
    if (references.current.topList && references.current.bottomList) {
      references.current.topList.scrollToIndex({
        index: state.selectedIndex,
        animated: false,
      });
      references.current.bottomList.scrollToIndex({
        index: state.selectedIndex,
        animated: false,
      });
    }
  }, [initIndex]);

  const onThumbnailSwitch = useCallback((index: number) => {
    if (references.current.topList && references.current.bottomList) {
      references.current.topList.scrollToIndex({
        index: index,
        animated: true,
      });
      references.current.bottomList.scrollToIndex({
        index: index,
        animated: true,
      });
    }
    setState({ selectedIndex: index });
  }, []);

  const renderBottomListItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PhotoInfo>) => {
      return (
        <PhotoGalleryBottomItem
          uri={item.uri}
          index={index}
          isFocused={state.selectedIndex === index}
          onSelect={onThumbnailSwitch}
        />
      );
    },
    [state]
  );

  const itemSeparator = useCallback(() => {
    return <View style={{ width: 12 }}></View>;
  }, []);

  const getBottomListItemLayout = useCallback(
    (_: PhotoInfo[] | null | undefined, index: number) => {
      return {
        index: index,
        offset: index * (SCREEN_WIDTH / 4 + 12),
        length: SCREEN_WIDTH / 4 + 12,
      };
    },
    []
  );

  const getTopListItemLayout = useCallback(
    (_: PhotoInfo[] | null | undefined, index: number) => {
      return {
        index: index,
        offset: SCREEN_WIDTH * index,
        length: SCREEN_WIDTH,
      };
    },
    []
  );

  const renderTopListItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PhotoInfo>) => {
      return (
        <PhotoGalleryTopItem
          index={index}
          photo={item}
          // animatedValue={references.current.scrollOffset}
        />
      );
    },
    [state]
  );

  const onScrollEnd = useCallback(
    ({
      nativeEvent: {
        contentOffset: { x },
      },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(x / SCREEN_WIDTH);
      if (references.current.bottomList) {
        references.current.bottomList.scrollToIndex({
          index,
          animated: true,
        });
      }
      setState({ selectedIndex: index });
    },
    [state]
  );

  return (
    <Animated.View
      style={styles.container}
      entering={ZoomIn.duration(300)}
      exiting={ZoomOut.duration(300)}
    >
      <BlurView style={styles.blurOverlay} blurAmount={10} blurType="dark" />
      <FlatList
        ref={(list) => {
          references.current.topList = list;
        }}
        data={photos}
        getItemLayout={getTopListItemLayout}
        renderItem={renderTopListItem}
        keyExtractor={(item) => item.uri}
        style={{ flex: 1, zIndex: 3 }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        horizontal={true}
        onMomentumScrollEnd={onScrollEnd}
      />
      <FlatList
        ref={(list) => {
          references.current.bottomList = list;
        }}
        data={photos}
        renderItem={renderBottomListItem}
        keyExtractor={(item) => item.uri}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          position: "absolute",
          bottom: 30,
          zIndex: 5,
        }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: (SCREEN_WIDTH * 3) / 8,
        }}
        ItemSeparatorComponent={itemSeparator}
        getItemLayout={getBottomListItemLayout}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});
