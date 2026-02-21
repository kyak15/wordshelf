import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import {
  ScrollingFilterBar,
  type FilterOption,
} from "../components/molecules/ScrollingFilterBar";
import { SwipeableWordCard } from "../components/molecules/SwipeableWordCard";
import { Text } from "../components/atoms/Text";
import { LoadingSpinner } from "../components/atoms/LoadingSpinner";
import { useWords, useDeleteWord } from "shared/hooks/queries/useWords";
import { useLibraryBooks } from "shared/hooks/queries/useLibrary";
import { useTheme } from "../theme";
import { LibraryBookWithDetails, SavedWordRow } from "shared/types";

type WordsScreenRouteProp = RouteProp<RootStackParamList, "Words">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Words">;

export const WordsScreen: React.FC = () => {
  const { theme } = useTheme();
  const route = useRoute<WordsScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { initialFilter, masteryLevel, bookId } = route.params || {};

  // Fetch data
  const { data: words, isLoading: wordsLoading } = useWords();
  const { data: books, isLoading: booksLoading } = useLibraryBooks();
  const deleteWordMutation = useDeleteWord();

  const getInitialFilter = () => {
    if (initialFilter === "mastery_level" && masteryLevel !== undefined) {
      return `mastery_${masteryLevel}`;
    }
    if (initialFilter === "book" && bookId) {
      return `book_${bookId}`;
    }
    return "all";
  };

  const [activeFilter, setActiveFilter] = useState<string>(getInitialFilter());

  useEffect(() => {
    setActiveFilter(getInitialFilter());
  }, [initialFilter, masteryLevel, bookId]);

  const filters: FilterOption[] = [
    { id: "all", label: "All Words" },
    { id: "mastery_0", label: "🔴 Learning" },
    { id: "mastery_1", label: "🟡 Reviewing" },
    { id: "mastery_2", label: "🟢 Familiar" },
    { id: "mastery_3", label: "✅ Mastered" },
  ];

  // Add book filters if available
  if (books && books.length > 0) {
    filters.push({ id: "divider", label: "───" });

    // Add each book as a filter
    books.forEach((book: LibraryBookWithDetails) => {
      const wordCount =
        words?.filter(
          (w: SavedWordRow) => w.library_book_id === book.library_book_id,
        ).length || 0;

      // Only show books that have words
      if (wordCount > 0) {
        filters.push({
          id: `book_${book.library_book_id}`,
          label: `${book.book.title} (${wordCount})`,
        });
      }
    });
  }

  // Filter words based on active filter
  const filteredWords = words?.filter((word: SavedWordRow) => {
    if (activeFilter === "all") return true;

    if (activeFilter.startsWith("mastery_")) {
      const level = parseInt(activeFilter.split("_")[1]);
      return word.mastery_level === level;
    }

    // Book filters
    if (activeFilter.startsWith("book_")) {
      const bookIdFromFilter = activeFilter.replace("book_", "");
      return word.library_book_id === bookIdFromFilter;
    }

    return true;
  });

  const handleWordPress = (wordId: string) => {
    // TODO: Navigate to word detail or open edit modal
  };

  const handleDeleteWord = (wordId: string) => {
    deleteWordMutation.mutate(wordId);
  };

  // Loading state
  if (wordsLoading || booksLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="lg" />
        </View>
      </View>
    );
  }

  // Empty state
  if (!words || words.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyContainer}>
          <Text variant="h2" center style={styles.emptyTitle}>
            No words yet!
          </Text>
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            Start building your vocabulary by adding words from your books
          </Text>
        </View>
      </View>
    );
  }

  // No filtered results
  const noFilteredResults = filteredWords && filteredWords.length === 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Filter Bar */}
      <ScrollingFilterBar
        filters={filters}
        activeFilterId={activeFilter}
        onFilterSelect={(filterId) => {
          // Don't allow selecting the divider
          if (filterId !== "divider") {
            setActiveFilter(filterId);
          }
        }}
      />

      {/* Words List */}
      {noFilteredResults ? (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary" center>
            No words found with this filter
          </Text>
          <Text
            variant="caption"
            color="secondary"
            center
            style={styles.emptyHint}
          >
            Try a different filter or add more words
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.saved_word_id}
          renderItem={({ item }) => (
            <SwipeableWordCard
              word={item}
              onPress={() => handleWordPress(item.saved_word_id)}
              onDelete={handleDeleteWord}
              showMasteryLevel
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
  },
  emptyHint: {
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});
