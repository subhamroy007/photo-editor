import { ReactElement, useCallback } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
import { ACCOUNT_LIST_ITEM_SIZE } from "../../../constants/constants";
import { globalStyles } from "../../../constants/style";
import { AccountShortResponse } from "../../../constants/types";
import { AccountListItem } from "./AccountListItem";

export type AccountListProps = {
  accounts: AccountShortResponse[];
  renderLeftNode: (item: AccountShortResponse, index: number) => ReactElement;
  disabled?: boolean;
  onTap?: (index: number) => void;
  onLongPress?: (index: number) => void;
  onDoubleTap?: (index: number) => void;
};

export function AccountList({
  accounts,
  renderLeftNode,
  disabled,
  onDoubleTap,
  onLongPress,
  onTap,
}: AccountListProps) {
  const renderAccounts = useCallback(
    ({ item, index }: ListRenderItemInfo<AccountShortResponse>) => {
      return (
        <AccountListItem
          account={item}
          onDoubleTap={
            onDoubleTap
              ? () => {
                  onDoubleTap(index);
                }
              : undefined
          }
          onTap={
            onTap
              ? () => {
                  onTap(index);
                }
              : undefined
          }
          onLongPress={
            onLongPress
              ? () => {
                  onLongPress(index);
                }
              : undefined
          }
          disabled={disabled}
          LeftNode={() => {
            return renderLeftNode(item, index);
          }}
        />
      );
    },
    [renderLeftNode, onTap, onDoubleTap, onLongPress, disabled]
  );

  return (
    <FlatList
      data={accounts}
      renderItem={renderAccounts}
      showsVerticalScrollIndicator={false}
      style={[globalStyles.flex1]}
      contentContainerStyle={[globalStyles.paddingVerticalSize2]}
      getItemLayout={(_, index) => {
        return {
          index,
          length: ACCOUNT_LIST_ITEM_SIZE,
          offset: index * ACCOUNT_LIST_ITEM_SIZE,
        };
      }}
    />
  );
}
