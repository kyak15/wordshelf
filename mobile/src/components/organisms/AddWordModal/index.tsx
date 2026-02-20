import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";
import { LoadingSpinner } from "../../atoms/LoadingSpinner";
import { WordSearchResult } from "../../molecules/WordSearchResult";
import { DictionaryApiResponse } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import ModalHeader from "../../molecules/ModalHeader";
import SearchBar from "../../molecules/SearchBar";
import { wordsService } from "../../../services/words.service";
import { wordSearchService } from "../../../services/wordSearch.service";
import { useLibraryBooks } from "../../../hooks/queries/useLibrary";

interface AddWordModalProps {
  visible: boolean;
  onClose: () => void;
  bookId?: string;
}

type SearchState = "idle" | "loading" | "success" | "empty" | "error";

export const AddWordModal: React.FC<AddWordModalProps> = ({
  visible,
  onClose,
  bookId: propBookId,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { data: allBooks } = useLibraryBooks();

  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(
    propBookId,
  );
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [wordResult, setWordResult] = useState<DictionaryApiResponse | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation for success checkmark
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  // Auto-select reading book if no book provided
  useEffect(() => {
    if (!propBookId && allBooks && visible) {
      const readingBook = allBooks.find((book) => book.status === "reading");
      if (readingBook) {
        setSelectedBookId(readingBook.library_book_id);
      } else {
        // No reading book - show selector
        setShowBookSelector(true);
      }
    }
  }, [propBookId, allBooks, visible]);

  const selectedBook = allBooks?.find(
    (b) => b.library_book_id === selectedBookId,
  );
  const availableBooks = allBooks?.filter((b) => b.status !== "finished") || [];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchState("loading");
    setErrorMessage("");
    setWordResult(null);

    try {
      const result = await wordSearchService.searchWord(searchQuery);

      if (result) {
        setWordResult(result);
        setSearchState("success");
      } else {
        setSearchState("empty");
      }
    } catch (error) {
      setSearchState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const playSuccessAnimation = () => {
    setShowSuccess(true);
    setIsAdding(false);

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          resetSuccessAnimation();
          // Clear search so user can add another word
          setSearchQuery("");
          setSearchState("idle");
          setWordResult(null);
        });
      }, 1200);
    });
  };

  const resetSuccessAnimation = () => {
    successScale.setValue(0);
    successOpacity.setValue(0);
    setShowSuccess(false);
  };

  const handleSelectDefinition = async (
    definition: string,
    partOfSpeech: string,
    example?: string,
    audioUrl?: string,
  ) => {
    if (!wordResult) {
      setErrorMessage("No word selected.");
      return;
    }

    if (!selectedBookId) {
      Alert.alert(
        "No Book Selected",
        "Please select a book to add this word to.",
        [{ text: "OK", onPress: () => setShowBookSelector(true) }],
      );
      return;
    }

    setIsAdding(true);
    setErrorMessage("");

    try {
      await wordsService.addNewWord({
        library_book_id: selectedBookId,
        text: wordResult.word,
        language_code: "en",
        saved_definition: definition,
        saved_part_of_speech: partOfSpeech,
        saved_example: example,
        saved_audio_url: audioUrl,
      });

      // Invalidate words queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["words"] });
      // Also invalidate stats so "Books with Words" milestone updates
      queryClient.invalidateQueries({ queryKey: ["stats"] });

      playSuccessAnimation();
    } catch (error) {
      setIsAdding(false);
      setErrorMessage("Failed to add word. Please try again.");
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchState("idle");
    setWordResult(null);
    setErrorMessage("");
    setIsAdding(false);
    resetSuccessAnimation();
    onClose();
  };

  const renderEmptyState = () => {
    if (searchState === "idle") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="search-outline"
            size={64}
            color={theme.colors.divider}
          />
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            Search for a word
          </Text>
        </View>
      );
    }

    if (searchState === "empty") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="document-text-outline"
            size={64}
            color={theme.colors.divider}
          />
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            No definition found for "{searchQuery}"
          </Text>
          <Text variant="caption" color="secondary" center>
            Check the spelling or try a different word
          </Text>
        </View>
      );
    }

    if (searchState === "error") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="cloud-offline-outline"
            size={64}
            color={theme.colors.divider}
          />
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            {errorMessage}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ModalHeader title="Add Word" handleClose={handleClose} />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchState={searchState}
          placeholder="Search for a word"
        />

        {!propBookId && (
          <View
            style={[
              styles.warningBanner,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {selectedBook ? (
              <>
                <Ionicons name="book" size={20} color={theme.colors.accent} />
                <View style={styles.bookInfo}>
                  <Text variant="bodySmall" style={styles.bookLabel}>
                    Adding to:
                  </Text>
                  <Text
                    variant="body"
                    style={styles.bookTitle}
                    numberOfLines={1}
                  >
                    {selectedBook.book.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setShowBookSelector(true)}>
                  <Text
                    variant="bodySmall"
                    style={[styles.changeLink, { color: theme.colors.accent }]}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="alert-circle" size={20} color="#FF9800" />
                <Text variant="bodySmall" style={styles.warningText}>
                  No currently reading book
                </Text>
                <TouchableOpacity onPress={() => setShowBookSelector(true)}>
                  <Text
                    variant="bodySmall"
                    style={[styles.changeLink, { color: theme.colors.accent }]}
                  >
                    Select Book
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {errorMessage && searchState !== "error" && (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Ionicons name="alert-circle" size={20} color="#E53935" />
            <Text variant="bodySmall" style={styles.errorText}>
              {errorMessage}
            </Text>
          </View>
        )}

        {searchState === "loading" ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="lg" />
          </View>
        ) : searchState === "success" && wordResult ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <WordSearchResult
              word={wordResult}
              onSelectDefinition={handleSelectDefinition}
              isAdding={isAdding}
            />
          </ScrollView>
        ) : (
          renderEmptyState()
        )}

        {showSuccess && (
          <Animated.View
            style={[
              styles.successToast,
              {
                backgroundColor: theme.colors.success,
                transform: [{ scale: successScale }],
                opacity: successOpacity,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text variant="body" style={styles.successToastText}>
              Word added!
            </Text>
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      <Modal
        visible={showBookSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookSelector(false)}
      >
        <View style={styles.bookSelectorOverlay}>
          <View
            style={[
              styles.bookSelectorContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.bookSelectorHeader}>
              <Text variant="h3">Select a Book</Text>
              <TouchableOpacity onPress={() => setShowBookSelector(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.primaryText}
                />
              </TouchableOpacity>
            </View>

            {availableBooks.length === 0 ? (
              <View style={styles.noBooksContainer}>
                <Ionicons
                  name="book-outline"
                  size={48}
                  color={theme.colors.secondaryText}
                />
                <Text
                  variant="body"
                  color="secondary"
                  center
                  style={{ marginTop: 16 }}
                >
                  No books available
                </Text>
                <Text
                  variant="caption"
                  color="secondary"
                  center
                  style={{ marginTop: 8 }}
                >
                  Add a book to start saving words
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.bookList}>
                {availableBooks.map((book) => (
                  <TouchableOpacity
                    key={book.library_book_id}
                    style={[
                      styles.bookItem,
                      selectedBookId === book.library_book_id &&
                        styles.bookItemSelected,
                      { borderBottomColor: theme.colors.divider },
                    ]}
                    onPress={() => {
                      setSelectedBookId(book.library_book_id);
                      setShowBookSelector(false);
                    }}
                  >
                    <View style={styles.bookItemContent}>
                      <Text variant="body" numberOfLines={1}>
                        {book.book.title}
                      </Text>
                      {book.book.author && (
                        <Text
                          variant="caption"
                          color="secondary"
                          numberOfLines={1}
                        >
                          {book.book.author}
                        </Text>
                      )}
                    </View>
                    {book.status === "reading" && (
                      <View
                        style={[
                          styles.readingBadge,
                          { backgroundColor: theme.colors.accent },
                        ]}
                      >
                        <Text variant="caption" style={styles.readingBadgeText}>
                          Reading
                        </Text>
                      </View>
                    )}
                    {selectedBookId === book.library_book_id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.accent}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#E53935",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    gap: 8,
  },
  warningText: {
    flex: 1,
    color: "#FF9800",
  },
  bookInfo: {
    flex: 1,
  },
  bookLabel: {
    color: "#666",
    marginBottom: 2,
  },
  bookTitle: {
    fontWeight: "600",
  },
  changeLink: {
    fontWeight: "600",
  },
  successToast: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  successToastText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bookSelectorOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  bookSelectorContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  bookSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  bookList: {
    maxHeight: 400,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  bookItemSelected: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  bookItemContent: {
    flex: 1,
  },
  readingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readingBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  noBooksContainer: {
    padding: 48,
    alignItems: "center",
  },
});
