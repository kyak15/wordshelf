import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";

export default function AddButton() {
  const { theme } = useTheme();
  return (
    <Ionicons name="add-circle-outline" size={24} color={theme.colors.accent} />
  );
}
