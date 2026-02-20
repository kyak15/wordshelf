import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { Text } from "../Text";
import { useTheme } from "../../../theme";

interface SearchErrorBannerProps {
  errorMessage: string;
}

export default function SearchErrorBanner({
  errorMessage,
}: SearchErrorBannerProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.errorBanner, { backgroundColor: theme.colors.surface }]}
    >
      <Ionicons name="alert-circle" size={20} color="#E53935" />
      <Text variant="bodySmall" style={styles.errorText}>
        {errorMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#E53935",
  },
});
