import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { selectProfilePicuture } from "../../api/global/appSelector";
import {
  COLOR_7,
  COLOR_8,
  SHUTTER_ANIMATION_DURATION_MS,
  SHUTTER_HEIGHT,
  SIZE_21,
  SIZE_6,
  SIZE_9,
  TAB_BAR_HEIGHT,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { AppIcon } from "./AppIcon";
import { AppLabel } from "./AppLabel";
import { Tappable } from "./Tappable";

export function Shutter(props: BottomTabBarProps) {
  const {
    state: { index, routes },
    navigation,
  } = props;

  const [isModalOpen, setModalOpen] = useState(false);

  const profilePicture = useStoreSelector(selectProfilePicuture);

  const animatedValue = useSharedValue(0);

  const toggleModalOpenState = useCallback(() => {
    setModalOpen((prevState) => !prevState);
  }, []);

  const navigateTo = useCallback(
    (screen: string) => {
      if (screen === "CreateContent" || screen === "Chat") {
        navigation
          .getParent("root-material-top-tab-navigator")
          ?.navigate(screen);
      } else {
        navigation.navigate("UtilityStacks", { screen });
      }
    },
    [navigation]
  );

  const shiftShutter = useCallback(
    (open: boolean = true, screen?: string) => {
      animatedValue.value = withTiming(
        open ? -SHUTTER_HEIGHT : 0,
        { duration: SHUTTER_ANIMATION_DURATION_MS },
        () => {
          if (!open) {
            runOnJS(toggleModalOpenState)();
            if (screen) {
              runOnJS(navigateTo)(screen);
            }
          }
        }
      );
    },
    [navigateTo]
  );

  const emitEvent = useCallback(
    (screenIndex: number) => {
      const event = navigation.emit({
        type: "tabPress",
        target: routes[screenIndex].key,
        canPreventDefault: true,
      });

      if (
        routes[index].name !== routes[screenIndex].name &&
        !event.defaultPrevented
      ) {
        navigation.navigate(routes[screenIndex]);
      }
    },
    [navigation, index, routes]
  );

  const shutterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: animatedValue.value }],
    };
  });

  return (
    <View
      style={[
        globalStyles.flexRow,
        globalStyles.primaryLightBackgroundColor,
        styles.tabBar,
      ]}
    >
      <Pressable
        onPress={() => {
          emitEvent(0);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon name={index === 0 ? "home-solid" : "home-outline"} />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(1);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon name={index === 1 ? "video-solid" : "video-outline"} />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(2);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon name={index === 0 ? "shorts" : "shorts"} />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(3);
        }}
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon
          name={index === 3 ? "notification-solid" : "notification-outline"}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          emitEvent(4);
        }}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <Image
          resizeMode="cover"
          style={{
            width: SIZE_9,
            height: SIZE_9,
            borderWidth: index === 4 ? StyleSheet.hairlineWidth * 4 : 0,
            borderColor: COLOR_7,
            borderRadius: SIZE_9 / 2,
          }}
          fadeDuration={0}
          source={
            profilePicture === ""
              ? require("../../assets/icons/defaultprofilepicture.png")
              : { uri: profilePicture }
          }
        />
      </Pressable>
      <Pressable
        onPress={toggleModalOpenState}
        android_disableSound
        style={[
          globalStyles.flex1,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <AppIcon name="filter" />
      </Pressable>
      <Modal
        visible={isModalOpen}
        transparent
        statusBarTranslucent
        animationType="fade"
        onShow={() => {
          shiftShutter();
        }}
        onRequestClose={() => {
          shiftShutter(false);
        }}
      >
        <GestureHandlerRootView
          style={[globalStyles.flex1, globalStyles.justifyEnd]}
        >
          <Pressable
            style={[
              globalStyles.semitransparentBackgroundColor,
              StyleSheet.absoluteFill,
            ]}
            onPress={() => {
              shiftShutter(false);
            }}
          />
          <Animated.View style={[styles.shutter, shutterAnimatedStyle]}>
            <View
              style={[
                styles.topLabelContainer,
                globalStyles.justifyCenter,
                globalStyles.alignCenter,
              ]}
            >
              <View
                style={[
                  styles.topLabel,
                  globalStyles.secondaryLightBackgroundColor,
                ]}
              />
            </View>
            <View style={[globalStyles.flex1, globalStyles.flexRow]}>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "Settings");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="settings-outline" gap="large" isBorderVisible />
                <AppLabel
                  text="Settings"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "Saved");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="bookmark-outline" gap="large" isBorderVisible />
                <AppLabel
                  text="Saved"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "CloseToMe");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="following" gap="large" isBorderVisible />
                <AppLabel
                  text="Close To Me"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
            </View>
            <View style={[globalStyles.flex1, globalStyles.flexRow]}>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "Chat");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="message-outline" gap="large" isBorderVisible />
                <AppLabel
                  text="Chats"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "CreateContent");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="create" gap="large" isBorderVisible />
                <AppLabel
                  text="Create"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
              <Tappable
                type="animated"
                onTap={() => {
                  shiftShutter(false, "Favourites");
                }}
                style={[
                  globalStyles.flex1,
                  globalStyles.justifyCenter,
                  globalStyles.alignCenter,
                ]}
              >
                <AppIcon name="heart-outline" gap="large" isBorderVisible />
                <AppLabel
                  text="Favourites"
                  styleProp={globalStyles.marginTopSize2}
                />
              </Tappable>
            </View>
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shutter: {
    height: SHUTTER_HEIGHT,
    backgroundColor: COLOR_8,
    borderTopEndRadius: SIZE_6,
    borderTopStartRadius: SIZE_6,
    borderTopLeftRadius: SIZE_6,
    borderTopRightRadius: SIZE_6,
    bottom: -SHUTTER_HEIGHT,
  },
  tabBar: {
    height: TAB_BAR_HEIGHT,
  },
  topLabel: {
    width: SIZE_21,
    height: 8 * StyleSheet.hairlineWidth,
    borderRadius: 8 * StyleSheet.hairlineWidth,
  },
  topLabelContainer: {
    height: SIZE_6,
  },
});
