import React from "react";
import { View, StyleSheet } from "react-native";
import { BookCard } from "../BookCard";
import { SectionHeader } from "../../atoms/SectionHeader";
import { useLibraryBooks } from "../../../hooks/queries/useLibrary";

interface WordsByBookCardProps {
  wordCountsByBook?: Record<string, number>; // bookId -> wordCount
  onBookPress?: (bookId: string) => void;
}

export const WordsByBookCard: React.FC<WordsByBookCardProps> = ({
  wordCountsByBook = {},
  onBookPress,
}) => {
  const { data: bookData, isLoading, isError } = useLibraryBooks();

  if (isLoading || isError || !bookData || bookData.length === 0) {
    return null;
  }

  const validBooks = bookData
    .filter((book) => book && book.library_book_id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return (
    <View style={styles.container}>
      <SectionHeader title="Words by Book" />
      <View style={styles.bookList}>
        {validBooks.map((book) => {
          const wordCount = wordCountsByBook[book.library_book_id] || 0;

          return (
            <View key={book.library_book_id} style={styles.bookItem}>
              <BookCard
                book={book}
                wordCount={wordCount}
                showProgress={false}
                onPress={() => onBookPress?.(book.library_book_id)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  bookList: {},
  bookItem: {
    marginBottom: 12,
  },
});
