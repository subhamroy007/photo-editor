import { useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { SIZE_15, SIZE_5 } from "../../../constants/constants";
import { AccountResponse } from "../../../constants/types";
import { AccountShortListItem } from "./AccountShortListItem";

export type AccountShortListProps = {
  onSelect: (accountId: string) => void;
  accounts: AccountResponse[];
};

export function AccountShortList({
  accounts,
  onSelect,
}: AccountShortListProps) {
  const renderAccount = useCallback(
    ({ item }: ListRenderItemInfo<AccountResponse>) => {
      return (
        <AccountShortListItem
          account={item}
          onSelect={() => {
            onSelect(item.userid);
          }}
        />
      );
    },
    []
  );

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="none"
      keyboardShouldPersistTaps="always"
      data={accounts}
      renderItem={renderAccount}
      getItemLayout={(_, index) => {
        const size = 2 * SIZE_5 + SIZE_15;
        return {
          index,
          length: size,
          offset: index * size,
        };
      }}
    />
  );
}
