import { TypedUseSelectorHook, useSelector } from "react-redux";
import { StoreRootState } from "../api/store";

export const useStoreSelector: TypedUseSelectorHook<StoreRootState> =
  useSelector;
