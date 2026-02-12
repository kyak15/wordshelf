import React from "react";
import { View, StyleSheet } from "react-native";
import { BookCard } from "../BookCard";
import { SectionHeader } from "../../atoms";
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

  // Filter out books with no words and ensure book data is valid
  const booksWithWords = bookData.filter((book) => {
    if (!book || !book.library_book_id) return false;
    const wordCount = wordCountsByBook[book.library_book_id] || 0;
    return wordCount > 0;
  });

  if (booksWithWords.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <SectionHeader title="Words by Book" />
      <View style={styles.bookList}>
        {booksWithWords.map((book) => {
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
  container: {
    marginVertical: 12,
  },
  bookList: {
    paddingHorizontal: 16,
  },
  bookItem: {
    marginBottom: 12,
  },
});
