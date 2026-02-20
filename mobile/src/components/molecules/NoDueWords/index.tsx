import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../../theme";

interface NoDueWordsProps {
  handleClose: () => void;
}

export default function NoDueWords({ handleClose }: NoDueWordsProps) {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.colors.primaryText} />
        </TouchableOpacity>
      </View>
      <View style={styles.emptyContainer}>
        <Ionicons
          name="checkmark-circle"
          size={80}
          color={theme.colors.success}
        />
        <Text variant="h2" center style={styles.emptyTitle}>
          All Caught Up!
        </Text>
        <Text variant="body" color="secondary" center style={styles.emptyText}>
          No words due for review right now. Come back later!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
});
