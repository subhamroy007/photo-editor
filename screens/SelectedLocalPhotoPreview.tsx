import { useCallback, useRef } from "react";
import { Animated, ListRenderItemInfo, StyleSheet } from "react-native";
import { SCREEN_WIDTH } from "../constants/constants";
import { PreviewPhotoListItem } from "../components/create-content/PreviewPhotoListItem";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackNavigationParams } from "../navigators/RootStackNavigator";
import { AppContainer } from "../components/utility/AppContainer";
import { MediaParams } from "../constants/types";
import { AppHeader } from "../components/utility/AppHeader";
import { AppIcon } from "../components/utility/AppIcon";

type ScreenProps = NativeStackScreenProps<
  RootStackNavigationParams,
  "SelectedLocalPhotoPreview"
>;

export function SelectedLocalPhotoPreview({
  route: {
    params: { list },
  },
  navigation,
}: ScreenProps) {
  const offset = useRef<Animated.Value>(new Animated.Value(0)).current;

  const renderPhotos = useCallback(
    ({ item, index }: ListRenderItemInfo<MediaParams>) => {
      const animatedTranslation = offset.interpolate({
        inputRange: [index * SCREEN_WIDTH, (list.length - 1) * SCREEN_WIDTH],
        outputRange: [0, (list.length - 1 - index) * SCREEN_WIDTH],
        extrapolate: "clamp",
      });

      return (
        <PreviewPhotoListItem
          {...item}
          animatedTranslation={animatedTranslation}
        />
      );
    },
    [list]
  );

  const onLeftArrowPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <AppContainer
      stretchToFill={true}
      selfAlignment="stretch"
      majorAxisAlignment="start"
      minorAxisAlignment="center"
    >
      <Animated.FlatList
        style={styles.list}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: offset,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        data={list}
        keyExtractor={(item) => item.uri}
        renderItem={renderPhotos}
      />
      <AppHeader
        leftContainerChild={<AppIcon name="left-arrow" foreground="white" />}
        float={true}
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
});
