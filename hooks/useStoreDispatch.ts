import { useDispatch } from "react-redux";
import { StoreDispatch } from "../api/store";

export const useStoreDispatch: () => StoreDispatch = useDispatch;
