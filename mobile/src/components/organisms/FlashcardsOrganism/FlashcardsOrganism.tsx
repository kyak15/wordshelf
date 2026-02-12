import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ReviewBanner,
  MiniProgressCard,
  MasteryBreakdown,
  WordsByBookCard,
} from "../../molecules";
import { SectionHeader, Text } from "../../atoms";
import { useWords } from "../../../hooks/queries/useWords";
import { useTheme } from "../../../theme";

export const FlashcardsOrganism: React.FC = () => {
  const { theme } = useTheme();
  const { data: allWords, isLoading } = useWords();

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="body" color="secondary">
          Loading...
        </Text>
      </View>
    );
  }

  // Calculate stats from words data
  const wordsDue =
    allWords?.filter(
      (word) =>
        !word.is_archived &&
        (word.next_review_at === null ||
          new Date(word.next_review_at) <= new Date())
    ).length || 0;

  const totalWords = allWords?.length || 0;

  // TODO: Replace with actual data from stats API
  const streak = 5; // Placeholder
  const weeklyReview = 47; // Placeholder

  // Calculate mastery level breakdown
  const masteryLevels = [
    {
      level: 0,
      label: "Learning",
      color: "#E53935",
      count: allWords?.filter((w) => w.mastery_level === 0).length || 0,
    },
    {
      level: 1,
      label: "Reviewing",
      color: "#FF9800",
      count: allWords?.filter((w) => w.mastery_level === 1).length || 0,
    },
    {
      level: 2,
      label: "Familiar",
      color: "#FDD835",
      count: allWords?.filter((w) => w.mastery_level === 2).length || 0,
    },
    {
      level: 3,
      label: "Mastered",
      color: "#7CB342",
      count: allWords?.filter((w) => w.mastery_level === 3).length || 0,
    },
  ];

  // Calculate word counts by book
  const wordCountsByBook =
    allWords?.reduce((acc, word) => {
      acc[word.library_book_id] = (acc[word.library_book_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  const handleStartReview = () => {
    // TODO: Navigate to review session when implemented
    console.log("Start review session");
  };

  const handleMasteryLevelPress = (level: number) => {
    // TODO: Navigate to words filtered by mastery level when implemented
    console.log("Filter by mastery level:", level);
  };

  const handleBookPress = (bookId: string) => {
    // TODO: Navigate to book words when implemented
    console.log("Navigate to book words:", bookId);
  };

  // Empty state
  if (!isLoading && totalWords === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="h2" center style={styles.emptyTitle}>
          No words yet!
        </Text>
        <Text variant="body" color="secondary" center style={styles.emptyText}>
          Start building your vocabulary by adding words from your books
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Review Banner - Only show if words are due */}
      {wordsDue > 0 && (
        <ReviewBanner wordsDue={wordsDue} onStartReview={handleStartReview} />
      )}

      {/* Progress Stats */}
      <SectionHeader title="Your Progress" />
      <MiniProgressCard
        streak={streak}
        weeklyReview={weeklyReview}
        totalWords={totalWords}
      />

      {/* Mastery Breakdown */}
      <View style={styles.section}>
        <SectionHeader title="Words by Mastery" />
        <MasteryBreakdown
          levels={masteryLevels}
          onLevelPress={handleMasteryLevelPress}
        />
      </View>

      {/* Words by Book */}
      <View style={styles.section}>
        <WordsByBookCard
          wordCountsByBook={wordCountsByBook}
          onBookPress={handleBookPress}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 12,
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
});
