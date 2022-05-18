import { useLayout } from "@react-native-community/hooks";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import {
  SCREEN_WIDTH,
  SIZE_4,
  SIZE_5,
  SIZE_6,
} from "../../constants/constants";
import { AppContainer } from "./AppContainer";

export type AppHeader = {
  leftContainerChild?: ReactNode;
  rightContainerChild?: ReactNode;
  middleContainerChild?: ReactNode;
  float?: boolean;
};

export function AppHeader({
  leftContainerChild,
  middleContainerChild,
  rightContainerChild,
  float,
}: AppHeader) {
  return (
    <AppContainer
      contentOrientation="row"
      minorAxisAlignment="center"
      majorAxisAlignment={
        rightContainerChild && !leftContainerChild && !middleContainerChild
          ? "end"
          : "start"
      }
      selfAlignment="stretch"
      styleProp={{ zIndex: 100, position: float ? "absolute" : "relative" }}
      paddingLeft={SIZE_5}
      paddingRight={SIZE_5}
      paddingBottom={SIZE_6}
      paddingTop={SIZE_6}
    >
      {leftContainerChild && <AppContainer>{leftContainerChild}</AppContainer>}
      {middleContainerChild && (
        <AppContainer
          majorAxisAlignment={"center"}
          stretchToFill={true}
          styleProp={{
            marginLeft: leftContainerChild ? SIZE_5 : 0,
            marginRight: rightContainerChild ? SIZE_5 : 0,
          }}
        >
          {middleContainerChild}
        </AppContainer>
      )}
      {rightContainerChild && (
        <AppContainer>{rightContainerChild}</AppContainer>
      )}
    </AppContainer>
  );
}
