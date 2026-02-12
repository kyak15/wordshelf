import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text, LoadingSpinner } from "../../atoms";
import { WordSearchResult } from "../../molecules/WordSearchResult/WordSearchResult";
import { DictionaryApiResponse } from "../../../types";
import { useQueryClient } from "@tanstack/react-query";
import ModalHeader from "../../molecules/ModalHeader/ModalHeader";
import SearchBar from "../../molecules/SearchBar/SearchBar";
import { wordsService } from "../../../services/words.service";
import { wordSearchService } from "../../../services/wordSearch.service";

interface AddWordModalProps {
  visible: boolean;
  onClose: () => void;
  bookId?: string; // Optional: if adding word from a specific book
}

type SearchState = "idle" | "loading" | "success" | "empty" | "error";

export const AddWordModal: React.FC<AddWordModalProps> = ({
  visible,
  onClose,
  bookId = "62dbfed8-0f3c-4c48-bd63-ce5755b582f7",
}) => {
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [wordResult, setWordResult] = useState<DictionaryApiResponse | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation for success checkmark
  const successScale = useRef(new Animated.Value(0)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

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

  const handleSelectDefinition = async (
    definition: string,
    partOfSpeech: string,
    example?: string,
    audioUrl?: string
  ) => {
    if (!wordResult || !bookId) {
      setErrorMessage("Please select a book first before adding words.");
      return;
    }

    setIsAdding(true);
    setErrorMessage("");

    try {
      await wordsService.addNewWord({
        library_book_id: bookId,
        text: wordResult.word,
        language_code: "en",
        saved_definition: definition,
        saved_part_of_speech: partOfSpeech,
        saved_example: example,
        saved_audio_url: audioUrl,
      });

      // Invalidate words queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["words"] });

      // Play success animation
      playSuccessAnimation();
    } catch (error) {
      setIsAdding(false);
      setErrorMessage("Failed to add word. Please try again.");
    }
  };

  const handleClose = () => {
    // Reset state
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

        {/* Book Warning Banner */}
        {!bookId && (
          <View
            style={[
              styles.warningBanner,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Ionicons name="information-circle" size={20} color="#FF9800" />
            <Text variant="bodySmall" style={styles.warningText}>
              Select a book first to add words to your library
            </Text>
          </View>
        )}

        {/* Error Banner */}
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

        {/* Results */}
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
                Word Added!
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
