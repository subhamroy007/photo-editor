import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SHUTTER_HEADER_HEIGHT,
} from "../constants/constants";
import { POST_DATA } from "../constants/data";
import { PostResponse } from "../constants/types";
import useAppSafeAreaInsets from "../hooks/useAppSafeAreaInsets";
import { RootStackNavigationParams } from "../navigators/RootStackNavigator";
import rnTextSize, { TSFontSpecs } from "react-native-text-size";
import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from "react-native-navigation-bar-color";
import { Video } from "expo-av";

export type ScreenProps = NativeStackScreenProps<
  RootStackNavigationParams,
  "TempScreen"
>;

export function TempScreen({ navigation, route }: ScreenProps) {
  const [data, setData] = useState<PostResponse[]>([]);

  const [loadingStoryUserId, setLoadingStoryUserId] = useState("");

  const [isMuted, setMuted] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(POST_DATA);
    }, 2000);
  }, []);

  const { bottom, left, right, top } = useAppSafeAreaInsets();

  const width = isFullscreen ? SCREEN_WIDTH : SCREEN_WIDTH - left - right;

  const height = isFullscreen
    ? SCREEN_HEIGHT
    : SCREEN_HEIGHT - top - bottom - SHUTTER_HEADER_HEIGHT;

  const text = `New Dance cover on bhool bhulaiya - 2 is up on my youtube Channel #sharmasisters
Please show some love!

Outfit

Styled by @rimadidthat
Top @houseofreeofficial
Joggers @houseofreeofficial
PR @mediatribein

Location
@kingsdancestudioandheri

.
.
.
.
.

#love
#instagood
#photooftheday
#fashion
#beautiful
#happy
#cute
#tbt
#like4like
#followme
#picoftheday
#follow
#me
#selfie
#summer
#art
#instadaily
#friends
#repost
#nature
#girl
#fun
#style
#smile
#food
#instalike
#likeforlikes
#bhoolbhulaiyaa2
#kartikaaryan`;

  const [state, setState] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      // const result = await rnTextSize.measure({
      //   text,
      //   allowFontScaling: false,
      //   fontSize: 14,
      //   width: SCREEN_WIDTH,
      // });
      // const result = await rnTextSize.flatHeights({
      //   text: [text],
      //   width: SCREEN_WIDTH,
      // });
      // console.log(result);
      changeNavigationBarColor("white", true, true);
    };
    prepare();
  }, [text]);

  useEffect(() => {
    if (state) {
      console.log("hiding");
      hideNavigationBar();
      changeNavigationBarColor("white", true, true);
      StatusBar.setHidden(true, "slide");
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("white", true);
      StatusBar.setBarStyle("dark-content");
    } else {
      console.log("showing");
      showNavigationBar();
      changeNavigationBarColor("white", true, true);
      StatusBar.setHidden(false, "slide");
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("white", true);
      StatusBar.setBarStyle("dark-content");
    }
  }, [state]);

  return (
    <SafeAreaView
      edges={!state ? ["bottom", "left", "right", "top"] : []}
      style={{
        alignSelf: "stretch",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 200,
          height: 200,
          backgroundColor: "green",
          marginTop: 10,
        }}
      />
      <Pressable
        onPress={() => {
          setState((prevState) => !prevState);
        }}
      >
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: "green",
            marginBottom: 10,
          }}
        />
      </Pressable>
      {/* <ScrollView style={{ flex: 1, alignSelf: "stretch" }}>
        <Text
          style={{
            // fontSize: 14,
            color: "black",
          }}
          allowFontScaling={false}
          onLayout={({
            nativeEvent: {
              layout: { height, width },
            },
          }) => {
            console.log(height, width);
          }}
        >
          {text}
        </Text>
      </ScrollView> */}
    </SafeAreaView>
  );
}
