import { useCallback } from "react";
import { clearInteractionId, setInteractionId } from "../api/global/appSlice";
import { useStoreDispatch } from "./useStoreDispatch";

export function useInteraction() {
  const dispatch = useStoreDispatch();

  const setInteraction = useCallback(() => {
    dispatch(setInteractionId());
  }, []);

  const clearInteraction = useCallback(() => {
    dispatch(clearInteractionId());
  }, []);

  return {
    setInteraction,
    clearInteraction,
  };
}
