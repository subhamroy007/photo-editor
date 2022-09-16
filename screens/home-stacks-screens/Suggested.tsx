import { AppHeader } from "../../components/utility/AppHeader";
import { Screen } from "../../components/utility/Screen";

export function Suggested() {
  return (
    <Screen type="partial-fullscreen">
      <AppHeader leftIcon="arrow-left" title={"Post"} transparent />
    </Screen>
  );
}
