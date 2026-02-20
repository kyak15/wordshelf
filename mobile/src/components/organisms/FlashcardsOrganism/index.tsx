import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { ReviewBanner } from "../../molecules/ReviewBanner";
import { MasteryBreakdown } from "../../molecules/MasteryBreakdown";
import { WordsByBookCard } from "../../molecules/WordsByBookCard";
import { SectionHeader } from "../../atoms/SectionHeader";
import { Text } from "../../atoms/Text";
import { useWords } from "../../../hooks/queries/useWords";
import { useStreak, useWeeklyReviews } from "../../../hooks/queries/useStats";
import { useTheme } from "../../../theme";
import { getMasteryLevelCounts } from "../../../constants/mastery";
import { LoadingSpinner } from "../../atoms/LoadingSpinner";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FlashcardsOrganism: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { data: allWords, isLoading } = useWords();
  const { data: streakData } = useStreak();
  const { data: weeklyReviews } = useWeeklyReviews();

  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  const wordsDue =
    allWords?.filter(
      (word) =>
        !word.is_archived &&
        (word.next_review_at === null ||
          new Date(word.next_review_at) <= new Date()),
    ).length || 0;

  const totalWords = allWords?.length || 0;

  const streak = streakData?.currentStreak || 0;
  const weeklyReview = weeklyReviews || 0;

  // Calculate mastery level breakdown
  const masteryLevels = getMasteryLevelCounts(allWords);

  // Calculate word counts by book
  const wordCountsByBook =
    allWords?.reduce(
      (acc, word) => {
        acc[word.library_book_id] = (acc[word.library_book_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  const handleStartReview = () => {
    navigation.navigate("ReviewSession");
  };

  const handleMasteryLevelPress = (level: number) => {
    navigation.navigate("Words");
  };

  const handleBookPress = (bookId: string) => {
    navigation.navigate("BookDetail", { bookId });
  };

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
      {wordsDue > 0 && (
        <ReviewBanner wordsDue={wordsDue} onStartReview={handleStartReview} />
      )}

      <View style={styles.section}>
        <SectionHeader title="Words by Mastery" />
        <MasteryBreakdown
          levels={masteryLevels}
          onLevelPress={handleMasteryLevelPress}
        />
      </View>

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
    marginVertical: 8,
    paddingHorizontal: 16,
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
