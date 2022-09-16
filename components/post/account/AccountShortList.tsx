import { AccountShortResponse } from "../../../constants/types";
import { FlatList, ListRenderItemInfo } from "react-native";
import { useCallback } from "react";
import { AccountShortListItem } from "./AccountShortListItem";
import { SIZE_12, SIZE_21, SIZE_8 } from "../../../constants/constants";

export type AccountShortListProps = {
  accounts: AccountShortResponse[];
  transparent?: boolean;
  onSelect: (userid: string) => void;
};

export function AccountShortList({
  accounts,
  onSelect,
  transparent,
}: AccountShortListProps) {
  const renderAccounts = useCallback(
    ({ item }: ListRenderItemInfo<AccountShortResponse>) => {
      return (
        <AccountShortListItem
          {...item}
          transparent={transparent}
          onSelect={onSelect}
        />
      );
    },
    []
  );

  const getAccountLayout = useCallback(
    (data: AccountShortResponse[] | null | undefined, index: number) => {
      const length = SIZE_8 * 2 + SIZE_21;
      return {
        index,
        length,
        offset: length * index,
      };
    },
    []
  );

  const keyExtractor = useCallback(
    (item: AccountShortResponse, index: number) => {
      return item.userid;
    },
    []
  );

  return (
    <FlatList
      data={accounts}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      renderItem={renderAccounts}
      // getItemLayout={getAccountLayout}
    />
  );
}
