import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme";
import { Text, LoadingSpinner } from "../components/atoms";
import { useDueWords, useReviewWord } from "../hooks/queries/useWords";
import { SavedWordRow } from "../types";
import ReviewButtonCard from "../components/molecules/ReviewButtonCard/ReviewButtonCard";

const { width } = Dimensions.get("window");

type ReviewSessionRouteProp = RouteProp<RootStackParamList, "ReviewSession">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReviewSession"
>;

type ReviewQuality = 0 | 3 | 4 | 5; // Again, Hard, Good, Easy

export const ReviewSessionScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReviewSessionRouteProp>();

  const { data: dueWords, isLoading } = useDueWords();
  const reviewMutation = useReviewWord();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Animation values
  const flipAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(0))[0];

  const currentWord = dueWords?.[currentIndex];
  const totalWords = dueWords?.length || 0;
  const progress = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0;

  // Flip animation
  const flipCard = () => {
    if (isFlipped) return;

    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(true);
  };

  // Reset flip for next card
  const resetFlip = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
    setIsFlipped(false);
  };

  // Slide card away animation
  const slideCardAway = (callback: () => void) => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      callback();
    });
  };

  const handleReview = async (quality: ReviewQuality) => {
    if (!currentWord) return;

    try {
      // Submit review
      await reviewMutation.mutateAsync({
        wordId: currentWord.saved_word_id,
        review: { quality },
      });

      // Slide card away and move to next
      slideCardAway(() => {
        setReviewedCount((prev) => prev + 1);

        if (currentIndex < totalWords - 1) {
          setCurrentIndex((prev) => prev + 1);
          resetFlip();
        } else {
          // Session complete
          setSessionComplete(true);
        }
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      // TODO: Show error toast
    }
  };

  const handleClose = () => {
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

  // No words due
  if (!dueWords || dueWords.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.primaryText} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-circle"
            size={80}
            color={theme.colors.success}
          />
          <Text variant="h2" center style={styles.emptyTitle}>
            All Caught Up!
          </Text>
          <Text
            variant="body"
            color="secondary"
            center
            style={styles.emptyText}
          >
            No words due for review right now. Come back later!
          </Text>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.colors.primaryText} />
        </TouchableOpacity>
        <Text variant="body" color="secondary">
          {currentIndex + 1} / {totalWords}
        </Text>
      </View>

      {/* Progress Bar */}
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
          {/* Front of card (Question) */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cardContent}
              onPress={flipCard}
              activeOpacity={1}
              disabled={isFlipped}
            >
              <View style={styles.wordContainer}>
                <Text variant="h1" center style={styles.wordText}>
                  {currentWord?.text}
                </Text>
                {currentWord?.saved_audio_url && (
                  <Ionicons
                    name="volume-high"
                    size={32}
                    color={theme.colors.accent}
                    style={styles.audioIcon}
                  />
                )}
              </View>
              <Text
                variant="body"
                color="secondary"
                center
                style={styles.tapHint}
              >
                Tap to show definition
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Back of card (Answer) */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.answerContainer}>
                <Text variant="h2" center style={styles.wordText}>
                  {currentWord?.text}
                </Text>

                {currentWord?.saved_part_of_speech && (
                  <Text
                    variant="body"
                    color="secondary"
                    center
                    style={styles.partOfSpeech}
                  >
                    {currentWord.saved_part_of_speech}
                  </Text>
                )}

                {currentWord?.saved_definition && (
                  <Text variant="body" center style={styles.definition}>
                    {currentWord.saved_definition}
                  </Text>
                )}

                {currentWord?.saved_example && (
                  <Text
                    variant="bodySmall"
                    color="secondary"
                    center
                    style={styles.example}
                  >
                    "{currentWord.saved_example}"
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
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
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 20,
  },
  cardFront: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardBack: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  wordContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  wordText: {
    fontWeight: "700",
    marginBottom: 8,
  },
  audioIcon: {
    marginTop: 8,
  },
  tapHint: {
    marginTop: 16,
    opacity: 0.6,
  },
  answerContainer: {
    alignItems: "center",
    gap: 16,
  },
  partOfSpeech: {
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  definition: {
    lineHeight: 24,
    textAlign: "center",
  },
  example: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
