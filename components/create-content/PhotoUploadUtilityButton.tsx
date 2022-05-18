import Svg, { Circle } from "react-native-svg";
import { SIZE_17 } from "../../constants/constants";
import { AppAvatar } from "../utility/AppAvatar";
import { AppContainer } from "../utility/AppContainer";

const SIZE = SIZE_17 + 2;

export type PhotoUploadUtilityButtonProps = {
  isMultiSelected?: boolean;
};

export function PhotoUploadUtilityButton({
  isMultiSelected,
}: PhotoUploadUtilityButtonProps) {
  return (
    <AppContainer width={SIZE} height={SIZE}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - 2}
          strokeWidth={4}
          stroke="#3f71f2"
        />
      </Svg>
      <AppAvatar
        image={{
          uri: "https://www.news247plus.com/big/News247plus-news-image-23226-RashmikaMandannatroll%20RashmikaMandanna.jpg",
          width: 800,
          height: 1000,
        }}
        size="large"
        styleProp={{ position: "absolute" }}
      />
    </AppContainer>
  );
}
