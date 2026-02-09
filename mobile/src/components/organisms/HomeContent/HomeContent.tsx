import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../theme";
import { SectionHeader, Spacer } from "../../atoms";
import { BookCard } from "../../molecules";

// Mock data - replace with real data fetching later
const MOCK_CURRENTLY_READING = {
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  coverUri: "https://covers.openlibrary.org/b/id/8432047-M.jpg",
  currentPage: 142,
  totalPages: 180,
};

export const HomeContent: React.FC = () => {
  const { theme } = useTheme();

  const handleBookPress = () => {
    // TODO: Navigate to book details
    console.log("Navigate to book details:", MOCK_CURRENTLY_READING.id);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title="Currently Reading" />
      <Spacer size="sm" />
      <BookCard
        title={MOCK_CURRENTLY_READING.title}
        author={MOCK_CURRENTLY_READING.author}
        coverUri={MOCK_CURRENTLY_READING.coverUri}
        currentPage={MOCK_CURRENTLY_READING.currentPage}
        totalPages={MOCK_CURRENTLY_READING.totalPages}
        onPress={handleBookPress}
      />
      <SectionHeader title="Recently Saved Words" />
      <Spacer size="sm" />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
