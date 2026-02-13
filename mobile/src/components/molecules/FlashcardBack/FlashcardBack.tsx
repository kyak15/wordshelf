import { Animated, View, StyleSheet } from "react-native";
import { Text } from "../../atoms";

interface FlashCardBackProps {
  text: string;
  savedPartOfSpeech?: string | null;
  savedDefinition?: string | null;
  savedExample?: string | null;
  backInterpolate: Animated.AnimatedInterpolation<string | number>;
  backOpacity: Animated.AnimatedInterpolation<string | number>;
}

export default function FlashcardBack({
  text,
  savedPartOfSpeech,
  savedDefinition,
  savedExample,
  backInterpolate,
  backOpacity,
}: FlashCardBackProps) {
  return (
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
            {text}
          </Text>

          {savedPartOfSpeech && (
            <Text
              variant="body"
              color="secondary"
              center
              style={styles.partOfSpeech}
            >
              {savedPartOfSpeech}
            </Text>
          )}

          {savedDefinition && (
            <Text variant="body" center style={styles.definition}>
              {savedDefinition}
            </Text>
          )}

          {savedExample && (
            <Text
              variant="bodySmall"
              color="secondary"
              center
              style={styles.example}
            >
              "{savedExample}"
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 20,
  },
  cardBack: {
    justifyContent: "center",
    alignItems: "center",
  },
  partOfSpeech: {
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  example: {
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  definition: {
    lineHeight: 24,
    textAlign: "center",
  },
  wordText: {
    fontWeight: "700",
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  answerContainer: {
    alignItems: "center",
    gap: 16,
  },
});
