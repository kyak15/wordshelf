import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../theme";
import { BookThumbnail } from "../../atoms/BookThumbnail";
import { BookCardInfo } from "../../atoms/BookCardInfo";
import { BookCardProgress } from "../../atoms/BookCardProgress";
import { Text } from "../../atoms/Text";
import { LibraryBookWithDetails } from "../../../types";

interface BookCardProps {
  book: LibraryBookWithDetails;
  onPress: () => void;
  showStatus?: boolean; // For library view
  showProgress?: boolean; // For library view
  wordCount?: number; // For flashcard view
  compact?: boolean; // Smaller version if needed
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  showStatus,
  showProgress,
  wordCount,
  compact,
}) => {
  const { theme } = useTheme();

  // Safety check: if book or book.book is undefined, return null
  if (!book || !book.book) {
    return null;
  }

  // Determine what to show in the bottom section
  const shouldShowProgress =
    showProgress !== false &&
    book.current_page !== undefined &&
    book.current_page !== null;
  const shouldShowWordCount = wordCount !== undefined;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colorScheme === "dark" ? "#000" : "#2E2A24",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BookThumbnail uri={book.book.cover_image_url} size="medium" />
      <View style={styles.content}>
        <BookCardInfo title={book.book.title} author={book.book.author} />

        {shouldShowProgress && book.current_page && (
          <BookCardProgress
            currentPage={book.current_page}
            totalPages={book.totalPages || 0}
          />
        )}

        {shouldShowWordCount && (
          <View
            style={[
              styles.wordCountBadge,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <Text variant="caption" style={styles.wordCountText}>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 0,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  wordCountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  wordCountText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
