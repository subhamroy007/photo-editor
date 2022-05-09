import { useCallback, useState } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet } from "react-native";
import { SCREEN_HEIGHT, SIZE_5 } from "../../constants/constants";
import { AccountShortResponse } from "../../constants/types";
import { AppContainer } from "../utility/AppContainer";
import { AppTextInput } from "../utility/AppTextInput";
import { AccountListItem } from "./AccountListItem";
import { TaggedAccount } from "./TaggedAccount";

export type AccountSearchState = {
  searchResult: AccountShortResponse[];
  searchQuery: string;
};

export type AccountSearchProps = {
  onAccountAdd: (account: AccountShortResponse) => void;
  onAccountRemove: (id: string) => void;
  tagged: AccountShortResponse[];
};

export function AccountSearch({
  onAccountAdd,
  onAccountRemove,
  tagged,
}: AccountSearchProps) {
  const [state, setState] = useState<AccountSearchState>({
    searchQuery: "",
    searchResult: [
      {
        id: "100",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "200",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "300",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "400",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "500",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "600",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
      {
        id: "700",
        hasUnseenStory: true,
        profilePicture: {
          height: 899,
          uri: "https://img.mensxp.com/media/content/2021/Nov/Expensive-Items-Owned-By-Rashmika-Mandanna-1200x900_61964d03017a5.jpeg",
          width: 1200,
        },
        userId: "roybond007",
        username: "subham roy",
      },
    ],
  });

  const renderTaggedAccount = useCallback(
    ({ item }: ListRenderItemInfo<AccountShortResponse>) => {
      const onPress = () => {
        onAccountRemove(item.id);
      };

      return <TaggedAccount {...item} onPress={onPress} />;
    },
    [onAccountRemove]
  );

  const renderSearchResult = useCallback(
    ({ item }: ListRenderItemInfo<AccountShortResponse>) => {
      const onPress = () => {
        onAccountAdd(item);
        setState((prevState) => ({ ...prevState, searchQuery: "" }));
      };

      return <AccountListItem {...item} onPress={onPress} />;
    },
    [onAccountAdd]
  );

  const onSearchQueryChange = useCallback((text: string) => {
    setState((prevState) => ({ ...prevState, searchQuery: text }));
  }, []);

  return (
    <AppContainer
      selfAlignment="stretch"
      height={SCREEN_HEIGHT - 100}
      majorAxisAlignment="start"
    >
      <AppTextInput
        placeholder="Search Here"
        styleProp={{ margin: SIZE_5 }}
        style="solid"
        onTextChange={onSearchQueryChange}
        text={state.searchQuery}
      />
      <AppContainer selfAlignment="stretch" stretchToFill={true}>
        <FlatList
          data={tagged}
          renderItem={renderTaggedAccount}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
        {state.searchQuery !== "" && (
          <AppContainer
            width={"100%"}
            height={"100%"}
            styleProp={{ position: "absolute", backgroundColor: "white" }}
          >
            <FlatList
              data={state.searchResult}
              renderItem={renderSearchResult}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          </AppContainer>
        )}
      </AppContainer>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: "stretch",
    flex: 1,
  },
});
