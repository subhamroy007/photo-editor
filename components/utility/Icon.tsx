import { useCallback } from "react";
import { Image } from "react-native";
import { selectAppTheme, selectIcon } from "../../api/global/appSelector";
import {
  COLOR_12,
  COLOR_13,
  COLOR_19,
  COLOR_5,
  COLOR_7,
  COLOR_8,
  SIZE_10,
  SIZE_14,
  SIZE_23,
  SIZE_5,
  SIZE_9,
} from "../../constants/constants";
import { globalStyles } from "../../constants/style";
import { IconProps } from "../../constants/types";
import { useStoreSelector } from "../../hooks/useStoreSelector";

export function Icon({
  name,
  foreground,
  size,
  styleProp,
  transparent,
  type,
  alignment,
}: IconProps) {
  const theme = useStoreSelector(selectAppTheme);

  const getIcon = useCallback((state) => selectIcon(state, name), [name]);

  const iconUri = useStoreSelector(getIcon);

  let iconSize = 0;
  let foregroundColor = "";

  if (foreground) {
    foregroundColor = foreground;
  } else {
    if (!type || type === "primary") {
      foregroundColor = transparent || theme === "dark" ? COLOR_8 : COLOR_7;
    } else if (type === "secondary") {
      foregroundColor = transparent || theme === "dark" ? COLOR_13 : COLOR_12;
    } else {
      foregroundColor = transparent || theme === "dark" ? COLOR_19 : COLOR_5;
    }
  }

  switch (size) {
    case "small":
      iconSize = SIZE_10;
      break;
    case "large":
      iconSize = SIZE_9;
      break;
    case "extra-small":
      iconSize = SIZE_5;
      break;
    case "extra-large":
      iconSize = SIZE_14;
      break;
    case "medium":
    default:
      iconSize = SIZE_23;
      break;
  }

  return (
    <Image
      fadeDuration={0}
      resizeMode="contain"
      style={[
        {
          tintColor: foregroundColor,
          width: iconSize,
          height: iconSize,
        },
        !alignment || alignment === "center"
          ? globalStyles.alignSelfCenter
          : alignment === "start"
          ? globalStyles.alignSelfStart
          : globalStyles.alignSelfEnd,
        styleProp,
      ]}
      source={{ uri: iconUri }}
    />
  );
}
