import { useCallback, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import {
  SCREEN_HEIGHT,
  SIZE_15,
  SIZE_2,
  SIZE_4,
  SIZE_5,
  SIZE_7,
  SIZE_9,
  TEXT_MEDIUM_SIZE,
} from "../constants/constants";
import {
  AccountShortResponse,
  LocationShortResponse,
} from "../constants/types";
import { AppContainer } from "../components/utility/AppContainer";
import { AppHeader } from "../components/utility/AppHeader";
import { AppIcon } from "../components/utility/AppIcon";
import { AppLabel } from "../components/utility/AppLabel";
import { AppModal } from "../components/utility/AppModal";
import { AppTextInput } from "../components/utility/AppTextInput";
import { AccountSearch } from "../components/create-content/AccountSearch";
import { LocationSearch } from "../components/create-content/LocationSearch";
import { PhotoUploadAdvancedOption } from "../components/create-content/PhotoUploadAdvancedOption";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackNavigationParams } from "../navigators/RootStackNavigator";
import { AppPhoto } from "../components/utility/AppPhoto";

type ScreenProps = NativeStackScreenProps<
  RootStackNavigationParams,
  "PhotoUploadDetails"
>;

export type PhotoUploadDetailsState = {
  taggedLocation?: LocationShortResponse;
  taggedPeoples: AccountShortResponse[];
  isAddLocationModalOpen: boolean;
  isTagPeopleModalOpen: boolean;
  caption: string;
  showLikeCount: boolean;
  isCommentEnabled: boolean;
  isAdvancedOptionModalOpen: boolean;
};

export function PhotoUploadDetails({
  navigation,
  route: {
    params: { list },
  },
}: ScreenProps) {
  const [state, setState] = useState<PhotoUploadDetailsState>({
    taggedPeoples: [],
    isAddLocationModalOpen: false,
    isTagPeopleModalOpen: false,
    isAdvancedOptionModalOpen: false,
    caption: "",
    isCommentEnabled: true,
    showLikeCount: true,
  });

  const closeAddLocationModal = useCallback(() => {
    setState((prevState) => ({ ...prevState, isAddLocationModalOpen: false }));
  }, []);

  const opneAddLocationModal = useCallback(() => {
    if (state.taggedLocation) {
      setState((prevState) => ({
        ...prevState,
        taggedLocation: undefined,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAddLocationModalOpen: true,
      }));
    }
  }, [state.taggedLocation]);

  const onLocationSelect = useCallback((location: LocationShortResponse) => {
    setState((prevState) => ({
      ...prevState,
      taggedLocation: location,
      isAddLocationModalOpen: false,
    }));
  }, []);

  const openTagPeopleModal = useCallback(() => {
    setState((prevState) => ({ ...prevState, isTagPeopleModalOpen: true }));
  }, []);

  const closeTagPeopleModal = useCallback(() => {
    setState((prevState) => ({ ...prevState, isTagPeopleModalOpen: false }));
  }, []);

  const openAdvancedOptionModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAdvancedOptionModalOpen: true,
    }));
  }, []);

  const closeAdvancedOptionModal = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isAdvancedOptionModalOpen: false,
    }));
  }, []);

  const toggleLikeSwitch = useCallback((value: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showLikeCount: value,
    }));
  }, []);

  const toggleCommentSwitch = useCallback((value: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isCommentEnabled: value,
    }));
  }, []);

  const onAccountAdd = useCallback((account: AccountShortResponse) => {
    setState((prevState) => ({
      ...prevState,
      taggedPeoples: [account, ...prevState.taggedPeoples],
    }));
  }, []);

  const onAccountRemove = useCallback((id: string) => {
    setState((prevState) => ({
      ...prevState,
      taggedPeoples: prevState.taggedPeoples.filter(
        (account) => account.id !== id
      ),
    }));
  }, []);

  const onCaptionChange = useCallback((text: string) => {
    setState((prevState) => ({ ...prevState, caption: text }));
  }, []);

  const onTagLocationPress = useCallback(() => {
    if (!state.taggedLocation) {
      setState((prevState) => ({ ...prevState, isAddLocationModalOpen: true }));
    }
  }, [state.taggedLocation]);

  const onPost = useCallback(() => {
    console.log("bal post hobe");
  }, []);

  const onLeftArrowPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <AppContainer stretchToFill={true} selfAlignment="stretch">
      <StatusBar hidden={true} />
      <AppHeader
        leftContainerChild={
          <AppIcon
            name="left-arrow"
            foreground="black"
            onPress={onLeftArrowPress}
          />
        }
        middleContainerChild={
          <AppLabel
            text="Details"
            size="large"
            style="bold"
            foreground="black"
          />
        }
      />

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      >
        <AppContainer
          selfAlignment="stretch"
          paddingLeft={SIZE_5}
          paddingRight={SIZE_5}
        >
          <AppPhoto
            media={{ ...list[0] }}
            boxHeight={SIZE_2}
            boxWidth={SIZE_2}
            style="fill"
            styleProp={styles.photo}
          />
          <AppTextInput
            multiline={true}
            placeholder="Add Caption"
            onTextChange={onCaptionChange}
            text={state.caption}
          />
        </AppContainer>
        <AppContainer
          selfAlignment="stretch"
          contentOrientation="row"
          styleProp={{ marginTop: SIZE_15 }}
          onPress={openTagPeopleModal}
          paddingLeft={SIZE_5}
          paddingRight={SIZE_5}
          paddingBottom={SIZE_5}
          paddingTop={SIZE_5}
        >
          <AppIcon name="effect" size="medium" foreground="black" />
          <AppContainer
            stretchToFill={true}
            minorAxisAlignment="start"
            styleProp={{ marginHorizontal: SIZE_5 }}
          >
            <AppLabel
              text="Tag People"
              size="medium"
              style="medium"
              foreground="black"
            />
            {state.taggedPeoples.length > 0 && (
              <AppLabel
                text={
                  "@" +
                  state.taggedPeoples[0].userId +
                  (state.taggedPeoples.length > 1
                    ? " and " + (state.taggedPeoples.length - 1) + " others"
                    : "")
                }
                foreground="grey"
                size="small"
                styleProp={{ marginTop: SIZE_7 }}
              />
            )}
          </AppContainer>
          <AppIcon name="create" size="small" foreground="black" />
        </AppContainer>
        <AppContainer
          selfAlignment="stretch"
          contentOrientation="row"
          styleProp={styles.locationTagContainer}
          paddingLeft={SIZE_5}
          paddingRight={SIZE_5}
          paddingBottom={SIZE_5}
          paddingTop={SIZE_5}
          onPress={onTagLocationPress}
        >
          <AppIcon name="shorts" size="medium" foreground="black" />
          <AppContainer
            stretchToFill={true}
            minorAxisAlignment="start"
            styleProp={styles.locationTagInnerContainer}
          >
            <AppLabel
              text={
                state.taggedLocation
                  ? state.taggedLocation.title
                  : "Add Location"
              }
              size="medium"
              style="medium"
              foreground="black"
            />
            {state.taggedLocation && (
              <AppLabel
                text={state.taggedLocation.name}
                foreground="grey"
                size="small"
                styleProp={styles.taggedLocationLabel}
              />
            )}
          </AppContainer>
          <AppIcon
            name={state.taggedLocation ? "cross" : "create"}
            size="small"
            foreground="black"
            onPress={opneAddLocationModal}
          />
        </AppContainer>
        <AppLabel
          text="advanced options"
          foreground="grey"
          size="small"
          styleProp={styles.advancedOptionLabel}
          selfAlignment="start"
          hasUnderline={true}
          onPress={openAdvancedOptionModal}
        />
      </ScrollView>
      <AppLabel
        text="Post"
        background="#3f71f2"
        corner="small-round"
        gap="large"
        size="medium"
        foreground="white"
        type="solid"
        selfAlignment="stretch"
        style="medium"
        styleProp={styles.postLabel}
        onPress={onPost}
      />
      {state.isAddLocationModalOpen && (
        <AppModal title="Add Location" onClose={closeAddLocationModal}>
          <LocationSearch onLocationSelect={onLocationSelect} />
        </AppModal>
      )}
      {state.isTagPeopleModalOpen && (
        <AppModal title="Tag People" onClose={closeTagPeopleModal}>
          <AccountSearch
            onAccountAdd={onAccountAdd}
            onAccountRemove={onAccountRemove}
            tagged={state.taggedPeoples}
          />
        </AppModal>
      )}
      {state.isAdvancedOptionModalOpen && (
        <AppModal onClose={closeAdvancedOptionModal} title="Advanced Options">
          <PhotoUploadAdvancedOption
            isCommentEnabled={state.isCommentEnabled}
            showLikeCount={state.showLikeCount}
            toggleCommentSwitch={toggleCommentSwitch}
            toggleLikeSwitch={toggleLikeSwitch}
          />
        </AppModal>
      )}
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  postLabel: { margin: SIZE_5 },
  advancedOptionLabel: { marginTop: SIZE_15, marginLeft: SIZE_5 },
  locationTagInnerContainer: { marginHorizontal: SIZE_5 },
  locationTagContainer: { marginTop: SIZE_15 },
  taggedLocationLabel: { marginTop: SIZE_7 },
  photo: {
    marginBottom: SIZE_9,
  },
  listContentContainer: { paddingVertical: SIZE_5 },
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
});
