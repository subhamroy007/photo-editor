import { Screen } from "../../components/utility/Screen";
import { StoryScreenProps } from "../../constants/types";

export function Story({
  navigation,
  route: {
    params: { userid },
  },
}: StoryScreenProps) {
  return <Screen type="partial-fullscreen"></Screen>;
}
