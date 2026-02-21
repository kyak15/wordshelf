import { View, StyleSheet } from "react-native";
import SimpleWordCard from "../../atoms/SimpleWordCard";
import { useWords } from "shared/hooks/queries/useWords";
import { LoadingSpinner } from "../../atoms/LoadingSpinner";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../../theme";

export default function RecentlySavedWordsCard() {
  const { theme } = useTheme();
  const { data: words, isLoading } = useWords();

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <LoadingSpinner size="sm" />
      </View>
    );
  }

  const recentWords = words?.slice(0, 3) || [];

  if (recentWords.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <Text variant="body" color="secondary">
          No words saved yet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {recentWords.map((word) => (
        <SimpleWordCard
          key={word.saved_word_id}
          word={word.text}
          definition={word.saved_definition}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
