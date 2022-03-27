import { useBackHandler } from "@react-native-community/hooks";
import { ReactNode, useCallback, useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/constants";

export interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  const [height, setHeight] = useState(0);
  const modalLayout = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const onContentChange = useCallback((_: number, h: number) => {
    if (h < SCREEN_HEIGHT * 0.64) {
      setHeight(h);
    } else {
      setHeight(SCREEN_HEIGHT * 0.64);
    }
  }, []);

  const onModalLayoutChange = useCallback(
    ({
      nativeEvent: {
        layout: { height, width, x, y },
      },
    }: LayoutChangeEvent) => {
      modalLayout.current = { h: height, w: width, x, y };
    },
    []
  );

  const onBackgroundPress = useCallback(
    ({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
      if (modalLayout.current) {
        const { h, w, x, y } = modalLayout.current;
        if (pageX > x && pageX < x + w && pageY > y && pageY < y + h) {
          return;
        }
        onClose();
      }
    },
    [onClose]
  );

  useBackHandler(() => {
    onClose();
    return true;
  });

  return (
    <Pressable style={styles.rootContainer} onPress={onBackgroundPress}>
      <Animated.View
        style={styles.modalContainer}
        entering={ZoomIn.springify()}
        exiting={ZoomOut.duration(300)}
        onLayout={onModalLayoutChange}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView
          style={{ maxHeight: height }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={onContentChange}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fdfdfd",
    borderRadius: 20,
    alignItems: "stretch",
  },
  titleContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomColor: "#d1cbcb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  contentContainer: {
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 16,
  },
});
