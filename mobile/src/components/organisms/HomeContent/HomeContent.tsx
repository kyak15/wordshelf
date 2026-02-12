import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../../../theme";
import { SectionHeader, Spacer } from "../../atoms";
import { BookCard } from "../../molecules";
import RecentlySavedWordsCard from "../../molecules/RecentlySavedWordsCard/RecentlySavedWords";
import { useLibraryBooks } from "../../../hooks/queries/useLibrary";

export const HomeContent: React.FC = () => {
  const { theme } = useTheme();
  const { data, isLoading, isError } = useLibraryBooks();

  const handleBookPress = () => {
    // TODO: Navigate to book details
    console.log("Navigate to book details:");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title="Currently Reading" />
      <Spacer size="sm" />

      {/* Only show BookCard if we have a book */}
      {data?.map((book) => (
        <BookCard
          book={book}
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
          showProgress={true}
        />
      ))}

      <SectionHeader title="Recently Saved Words" />
      <Spacer size="sm" />
      <RecentlySavedWordsCard />
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
