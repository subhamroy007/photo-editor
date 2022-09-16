import { Modal, View } from "react-native";
import { globalStyles } from "../../constants/style";
import { AppLoadingIndicator } from "./AppLoadingIndicator";
import { Label } from "./Label";

export type FullScreenOverlayIndicatorProps = {
  visible: boolean;
  onDismiss: () => void;
};

export function FullScreenOverlayIndicator({
  onDismiss,
  visible,
}: FullScreenOverlayIndicatorProps) {
  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View
        style={[
          globalStyles.flex1,
          globalStyles.semiTransparentBackgroundColor,
          globalStyles.justifyCenter,
          globalStyles.alignCenter,
        ]}
      >
        <View
          style={[
            globalStyles.primaryLightBackgroundColor,
            globalStyles.paddingVerticalSize4,
            globalStyles.paddingHorizontalSize6,
            globalStyles.flexRow,
            globalStyles.alignCenter,
            globalStyles.borderTopRadiusSize2,
            globalStyles.borderBottomRadiusSize2,
          ]}
        >
          <AppLoadingIndicator size="small" />
          <Label
            text="Processing..."
            styleProp={globalStyles.marginLeftSize4}
          />
        </View>
      </View>
    </Modal>
  );
}
