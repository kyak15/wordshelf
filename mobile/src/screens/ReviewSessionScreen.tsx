import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { Text } from "../components/atoms/Text";
import { LoadingSpinner } from "../components/atoms/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { useDueWords, useReviewWord } from "../hooks/queries/useWords";
import type { SavedWordRow } from "../types";
import ReviewButtonCard from "../components/molecules/ReviewButtonCard";
import FlashcardBack from "../components/molecules/FlashcardBack";
import FlashcardFront from "../components/molecules/FlashcardFront";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewSession"
>;

type ReviewQuality = 0 | 3 | 4 | 5; // Again, Hard, Good, Easy

export const ReviewSessionScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  const { data: dueWords, isLoading } = useDueWords();
  const reviewMutation = useReviewWord();

  // Session queue - words that need to be reviewed (includes re-queued words)
  const [sessionQueue, setSessionQueue] = useState<SavedWordRow[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0); // Successful reviews (Good/Easy)
  const sessionInitialized = useRef(false);

  // Initialize session queue ONCE when dueWords first loads
  useEffect(() => {
    if (dueWords && dueWords.length > 0 && !sessionInitialized.current) {
      sessionInitialized.current = true;
      setSessionQueue([...dueWords]);
    }
  }, [dueWords]);

  // Animation values
  const flipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const currentWord = sessionQueue?.[currentIndex];
  const totalInQueue = sessionQueue?.length || 0;
  const remainingCards = totalInQueue - currentIndex;
  const originalCount = dueWords?.length || 0;
  // Progress based on successfully reviewed cards vs original count
  const progress =
    originalCount > 0 ? (reviewedCount / originalCount) * 100 : 0;

  // Flip animation
  const flipCard = () => {
    if (isFlipped || isAnimating.current) return;

    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(true);
  };

  // Slide card away animation
  const slideCardAway = (callback: () => void) => {
    isAnimating.current = true;
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      isAnimating.current = false;
      callback();
    });
  };

  const handleReview = async (quality: ReviewQuality) => {
    if (!currentWord) return;

    const isRequeue = quality === 0 || quality === 3;
    const wordToRequeue = isRequeue ? currentWord : null;

    try {
      // Submit review to backend
      await reviewMutation.mutateAsync({
        wordId: currentWord.saved_word_id,
        review: { quality },
      });

      // Slide card away and handle queue
      slideCardAway(() => {
        // Calculate new queue and next index
        let newQueue = [...sessionQueue];
        if (wordToRequeue) {
          newQueue = [...newQueue, wordToRequeue];
        }

        const nextIndex = currentIndex + 1;

        // Update queue state
        setSessionQueue(newQueue);

        // Check if there are more cards
        if (nextIndex < newQueue.length) {
          // Reset flip state and advance to next card
          flipAnim.setValue(0);
          setIsFlipped(false);
          setCurrentIndex(nextIndex);
        } else {
          setSessionComplete(true);
        }

        // Count successful reviews
        if (!isRequeue) {
          setReviewedCount((prev) => prev + 1);
        }
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleClose = () => {
    // Invalidate queries so the app refreshes with updated review data
    queryClient.invalidateQueries({ queryKey: ["words"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    navigation.goBack();
  };

  // Loading state
  if (isLoading) {
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

  // Session complete
  if (sessionComplete) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={styles.completeContainer}>
          <Ionicons name="trophy" size={80} color={theme.colors.accent} />
          <Text variant="h1" center style={styles.completeTitle}>
            Session Complete!
          </Text>
          <Text
            variant="h3"
            color="secondary"
            center
            style={styles.completeStats}
          >
            You reviewed {reviewedCount}{" "}
            {reviewedCount === 1 ? "word" : "words"}
          </Text>
          <TouchableOpacity
            style={[
              styles.doneButton,
              { backgroundColor: theme.colors.accent },
            ]}
            onPress={handleClose}
          >
            <Text variant="body" style={styles.doneButtonText}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Safety check: if currentWord is undefined, show completion
  if (!currentWord) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={styles.completeContainer}>
          <Ionicons name="trophy" size={80} color={theme.colors.accent} />
          <Text variant="h1" center style={styles.completeTitle}>
            Session Complete!
          </Text>
          <Text
            variant="h3"
            color="secondary"
            center
            style={styles.completeStats}
          >
            You reviewed {reviewedCount}{" "}
            {reviewedCount === 1 ? "word" : "words"}
          </Text>
          <TouchableOpacity
            style={[
              styles.doneButton,
              { backgroundColor: theme.colors.accent },
            ]}
            onPress={handleClose}
          >
            <Text variant="body" style={styles.doneButtonText}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Card flip interpolation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.colors.primaryText} />
        </TouchableOpacity>
        <Text variant="body" color="secondary">
          {remainingCards} remaining
        </Text>
      </View>

      {/* Progress */}
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: theme.colors.divider },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.accent, width: `${progress}%` },
          ]}
        />
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <FlashcardFront
            text={currentWord?.text || ""}
            frontInterpolate={frontInterpolate}
            frontOpacity={frontOpacity}
            flipCard={flipCard}
            isFlipped={isFlipped}
          />

          <FlashcardBack
            text={currentWord?.text || ""}
            savedPartOfSpeech={currentWord?.saved_part_of_speech}
            savedDefinition={currentWord?.saved_definition}
            savedExample={currentWord?.saved_example}
            backInterpolate={backInterpolate}
            backOpacity={backOpacity}
          />
        </Animated.View>
      </View>

      {isFlipped && (
        <ReviewButtonCard
          onReview={handleReview}
          disabled={reviewMutation.isPending}
        />
      )}
    </SafeAreaView>
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
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  progressBarContainer: {
    height: 4,
    width: "100%",
  },
  progressBar: {
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
  },
  completeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  completeTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  completeStats: {
    marginBottom: 32,
  },
  doneButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: width - 32,
    height: 400,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
