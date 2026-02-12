import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text, LoadingSpinner } from "../../atoms";
import { BookSearchResult } from "../../molecules";
import { bookSearchService } from "../../../services/bookSearch.service";
import { libraryService } from "../../../services/library.service";
import { GoogleBookResult } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import ModalHeader from "../../molecules/ModalHeader/ModalHeader";
import SearchBar from "../../molecules/SearchBar/SearchBar";
import SearchErrorBanner from "../../molecules/SearchErrorBanner/SearchErrorBanner";

interface AddBookModalProps {
  visible: boolean;
  onClose: () => void;
}

type SearchState = "idle" | "loading" | "success" | "empty" | "error";

export const AddBookModal: React.FC<AddBookModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [results, setResults] = useState<GoogleBookResult[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [addingBookId, setAddingBookId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation for success checkmark
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchState("loading");
    setErrorMessage("");

    try {
      const books = await bookSearchService.searchBooks(searchQuery);
      setResults(books);
      setSearchState(books.length > 0 ? "success" : "empty");
    } catch (error) {
      setSearchState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const playSuccessAnimation = () => {
    setShowSuccess(true);

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Hold for a moment, then close
      setTimeout(() => {
        handleClose();
      }, 800);
    });
  };

  const resetSuccessAnimation = () => {
    successScale.setValue(0);
    successOpacity.setValue(0);
    setShowSuccess(false);
  };

  const handleSelectBook = async (book: GoogleBookResult) => {
    setAddingBookId(book.id);

    try {
      await libraryService.addBook({
        title: book.title,
        author: book.authors.length > 0 ? book.authors.join(", ") : undefined,
        isbn13: book.isbn13 ?? undefined,
        cover_image_url: book.coverUrl ?? undefined,
        language_code: book.language,
      });

      // Invalidate library queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["library"] });

      // Play success animation
      playSuccessAnimation();
    } catch (error) {
      setAddingBookId(null);
      setErrorMessage("Failed to add book. Please try again.");
    }
  };

  const handleClose = () => {
    // Reset state
    setSearchQuery("");
    setSearchState("idle");
    setResults([]);
    setErrorMessage("");
    setAddingBookId(null);
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
            Search for a book by title or author
          </Text>
        </View>
      );
    }

    if (searchState === "empty") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="book-outline"
            size={64}
            color={theme.colors.divider}
          />
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            No books found for "{searchQuery}"
          </Text>
          <Text variant="caption" color="secondary" center>
            Try a different search term
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
        <ModalHeader title="Add Book" handleClose={handleClose} />

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchState={searchState}
          placeholder="Search by title or author"
        />

        {/* Error Banner */}
        {errorMessage && searchState !== "error" && (
          <SearchErrorBanner errorMessage={errorMessage} />
        )}

        {/* Results */}
        {searchState === "loading" ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="lg" />
          </View>
        ) : searchState === "success" ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BookSearchResult
                book={item}
                onPress={handleSelectBook}
                isAdding={addingBookId === item.id}
              />
            )}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          renderEmptyState()
        )}

        {/* Success Overlay */}
        {showSuccess && (
          <View style={styles.successOverlay}>
            <Animated.View
              style={[
                styles.successCircle,
                {
                  backgroundColor: theme.colors.success,
                  transform: [{ scale: successScale }],
                  opacity: successOpacity,
                },
              ]}
            >
              <Ionicons name="checkmark" size={64} color="#FFFFFF" />
            </Animated.View>
            <Animated.View style={{ opacity: successOpacity }}>
              <Text
                variant="h3"
                center
                style={[
                  styles.successText,
                  { color: theme.colors.primaryText },
                ]}
              >
                Book Added!
              </Text>
            </Animated.View>
          </View>
        )}
      </KeyboardAvoidingView>
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
  listContent: {
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
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successText: {
    marginTop: 16,
  },
});
