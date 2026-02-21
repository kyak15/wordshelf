import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { Text } from "../components/atoms/Text";
import { LoadingSpinner } from "../components/atoms/LoadingSpinner";
import { SectionHeader } from "../components/atoms/SectionHeader";
import { Spacer } from "../components/atoms/Spacer";
import { SavedWordCard } from "../components/molecules/SavedWordCard";
import {
  useLibraryBook,
  useUpdateLibraryBook,
  useDeleteLibraryBook,
} from "shared/hooks/queries/useLibrary";
import { useWords } from "shared/hooks/queries/useWords";

type BookDetailRouteProp = RouteProp<RootStackParamList, "BookDetail">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BookDetail"
>;

const READING_STATUSES = [
  { value: "planned", label: "To Read", icon: "bookmark-outline" as const },
  {
    value: "reading",
    label: "Currently Reading",
    icon: "book-outline" as const,
  },
  {
    value: "finished",
    label: "Completed",
    icon: "checkmark-circle-outline" as const,
  },
];

export const BookDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookDetailRouteProp>();
  const { bookId } = route.params;

  const { data: book, isLoading: bookLoading } = useLibraryBook(bookId);
  const { data: allWords, isLoading: wordsLoading } = useWords({ bookId });
  const updateBookMutation = useUpdateLibraryBook();
  const deleteBookMutation = useDeleteLibraryBook();

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!book) return;

    try {
      const result: any = await updateBookMutation.mutateAsync({
        bookId: book.library_book_id,
        data: { status: newStatus },
      });

      setShowStatusMenu(false);

      if (newStatus === "finished" && result?.promotedBook) {
        Alert.alert(
          "Book Completed! 📚",
          `"${result.promotedBook.book.title}" is now your current read`,
          [{ text: "Got it" }],
        );
      } else if (newStatus === "finished" && !result?.promotedBook) {
        Alert.alert(
          "Book Completed! ✓",
          "Add another book to continue reading",
          [{ text: "Got it" }],
        );
      } else if (
        newStatus === "planned" &&
        result?.promotedBook &&
        result.promotedBook.library_book_id !== book.library_book_id
      ) {
        Alert.alert(
          "Reading Status Changed",
          `"${result.promotedBook.book.title}" is now your current read`,
          [{ text: "Got it" }],
        );
      }
    } catch (error) {
      console.error("Failed to update book status:", error);
      Alert.alert("Error", "Failed to update reading status");
    }
  };

  const handleDeleteBook = () => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to remove this book from your library? This will also delete all saved words from this book.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBookMutation.mutateAsync(bookId);
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete book:", error);
              Alert.alert("Error", "Failed to delete book");
            }
          },
        },
      ],
    );
  };

  const handleWordPress = (wordId: string) => {
    // TODO: Navigate to word detail or show edit modal
  };

  if (bookLoading || !book) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  const currentStatus = READING_STATUSES.find((s) => s.value === book.status);
  const bookWords = allWords || [];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.primaryText}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteBook}
          style={styles.deleteButton}
          disabled={deleteBookMutation.isPending}
        >
          <Ionicons name="trash-outline" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bookInfoSection}>
          <View style={styles.coverContainer}>
            {book.book.cover_image_url ? (
              <Image
                source={{ uri: book.book.cover_image_url }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.coverPlaceholder,
                  { backgroundColor: theme.colors.divider },
                ]}
              >
                <Ionicons
                  name="book"
                  size={48}
                  color={theme.colors.secondaryText}
                />
              </View>
            )}
          </View>

          {/* Book Details */}
          <View style={styles.bookDetails}>
            <Text variant="h2" style={styles.bookTitle}>
              {book.book.title}
            </Text>

            {book.book.author && (
              <Text variant="body" color="secondary" style={styles.bookAuthor}>
                by {book.book.author}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.statusButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => setShowStatusMenu(!showStatusMenu)}
            >
              <Ionicons
                name={currentStatus?.icon || "bookmark-outline"}
                size={20}
                color={theme.colors.accent}
              />
              <Text variant="body" style={styles.statusText}>
                {currentStatus?.label || "Set Status"}
              </Text>
              <Ionicons
                name={showStatusMenu ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.secondaryText}
              />
            </TouchableOpacity>

            {showStatusMenu && (
              <View
                style={[
                  styles.statusMenu,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                {READING_STATUSES.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusMenuItem,
                      book.status === status.value &&
                        styles.statusMenuItemActive,
                    ]}
                    onPress={() => handleStatusChange(status.value)}
                    disabled={updateBookMutation.isPending}
                  >
                    <Ionicons
                      name={status.icon}
                      size={20}
                      color={
                        book.status === status.value
                          ? theme.colors.accent
                          : theme.colors.secondaryText
                      }
                    />
                    <Text
                      variant="body"
                      style={[
                        styles.statusMenuItemText,
                        book.status === status.value && {
                          color: theme.colors.accent,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {status.label}
                    </Text>
                    {book.status === status.value && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={theme.colors.accent}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <Spacer size="lg" />

        <View style={styles.statsSection}>
          {book.current_page && (
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text variant="h1" style={styles.statValue}>
                {book.current_page}
              </Text>
              <Text variant="body" color="secondary" style={styles.statLabel}>
                Current Page
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader
            title={`${bookWords.length} Saved ${
              bookWords.length === 1 ? "Word" : "Words"
            }`}
          />
          <Spacer size="xs" />

          {wordsLoading ? (
            <View style={styles.emptyContainer}>
              <LoadingSpinner size="md" />
            </View>
          ) : bookWords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="book-outline"
                size={64}
                color={theme.colors.secondaryText}
              />
              <Text variant="h3" center style={styles.emptyTitle}>
                No words yet
              </Text>
              <Text variant="body" color="secondary" center>
                Start saving words from this book
              </Text>
            </View>
          ) : (
            <View style={styles.wordsGrid}>
              {bookWords.map((word) => (
                <SavedWordCard
                  key={word.saved_word_id}
                  word={word}
                  onPress={() => handleWordPress(word.saved_word_id)}
                />
              ))}
            </View>
          )}
        </View>

        <Spacer size="lg" />
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  content: {
    paddingBottom: 24,
  },
  bookInfoSection: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  coverContainer: {
    marginBottom: 20,
  },
  coverImage: {
    width: 160,
    height: 240,
    borderRadius: 12,
  },
  coverPlaceholder: {
    width: 160,
    height: 240,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bookDetails: {
    width: "100%",
    alignItems: "center",
  },
  bookTitle: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  bookAuthor: {
    textAlign: "center",
    marginBottom: 20,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statusText: {
    flex: 1,
  },
  statusMenu: {
    marginTop: 8,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  statusMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  statusMenuItemActive: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  statusMenuItemText: {
    flex: 1,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    fontWeight: "600",
  },
  wordsGrid: {
    gap: 12,
  },
});
