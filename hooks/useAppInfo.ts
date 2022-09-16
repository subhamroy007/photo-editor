import {
  selectAppTheme,
  selectLogo,
  selectProfilePicuture,
} from "../api/global/appSelector";
import { useStoreSelector } from "./useStoreSelector";

export function useAppInfo() {
  const theme = useStoreSelector(selectAppTheme);

  const logo = useStoreSelector(selectLogo);

  const profilePicture = useStoreSelector(selectProfilePicuture);

  return {
    theme,
    logo,
    profilePicture,
  };
}
