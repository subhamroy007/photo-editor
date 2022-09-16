import { Image } from "react-native";
import { Screen } from "../../components/utility/Screen";

export function SuggestedMoments() {
  return (
    <Screen type="partial-fullscreen">
      <Image
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
        source={{
          uri: "https://www.adgully.com/img/800/202109/whatsapp-image-2021-09-27-at-11-12-35-am.jpeg",
          height: 1200,
          width: 800,
        }}
        fadeDuration={0}
      />
    </Screen>
  );
}
