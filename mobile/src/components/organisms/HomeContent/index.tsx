import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { useTheme } from "../../../theme";
import { SectionHeader } from "../../atoms/SectionHeader";
import { Spacer } from "../../atoms/Spacer";
import { Text } from "../../atoms/Text";
import { BookCard } from "../../molecules/BookCard";
import { MiniProgressCard } from "../../molecules/MiniProgressCard";
import RecentlySavedWordsCard from "../../molecules/RecentlySavedWordsCard";
import { useLibraryBooks } from "shared/hooks/queries/useLibrary";
import { useWords } from "shared/hooks/queries/useWords";
import { useStreak, useWeeklyReviews } from "shared/hooks/queries/useStats";
import GreetingCard from "../../atoms/GreetingCard";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeContent: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { data } = useLibraryBooks();
  const { data: allWords } = useWords();
  const { data: streakData } = useStreak();
  const { data: weeklyReviews } = useWeeklyReviews();

  const streak = streakData?.currentStreak || 0;
  const weeklyReview = weeklyReviews || 0;
  const totalWords = allWords?.length || 0;

  const handleBookPress = (bookId: string) => {
    navigation.navigate("BookDetail", { bookId });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <GreetingCard />

      <Spacer size="sm" />

      <View style={styles.section}>
        <SectionHeader title="Currently Reading" />
        <Spacer size="xs" />
        {data && data.filter((book) => book.status === "reading").length > 0 ? (
          data
            .filter((book) => book.status === "reading")
            .slice(0, 1)
            .map((book) => (
              <BookCard
                key={book.book_id}
                book={book}
                onPress={() => handleBookPress(book.library_book_id)}
                showProgress
              />
            ))
        ) : (
          <View
            style={[
              styles.emptyBookCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text variant="body" color="secondary" center>
              No book in progress
            </Text>
            <Text variant="caption" color="secondary" center>
              Add a book to start tracking your reading
            </Text>
          </View>
        )}
      </View>

      <Spacer size="md" />

      <View style={styles.section}>
        <SectionHeader title="Your Progress" />
        <Spacer size="xs" />
        <MiniProgressCard
          streak={streak}
          weeklyReview={weeklyReview}
          totalWords={totalWords}
        />
      </View>

      <Spacer size="md" />

      <View style={styles.section}>
        <SectionHeader title="Recently Saved Words" />
        <Spacer size="xs" />
        <RecentlySavedWordsCard />
      </View>

      <Spacer size="lg" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flex: 1,
    alignItems: "center",
  },
  greetings: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
  },
  emptyBookCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
