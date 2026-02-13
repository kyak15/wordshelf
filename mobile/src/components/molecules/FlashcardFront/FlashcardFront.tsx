import { Ionicons } from "@expo/vector-icons";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "../../atoms";
import { useTheme } from "../../../theme";

interface FlascardFrontProps {
  text: string;
  savedAudioUrl?: string;
  frontInterpolate: Animated.AnimatedInterpolation<string | number>;
  frontOpacity: Animated.AnimatedInterpolation<string | number>;
  flipCard: () => void;
  isFlipped: boolean;
}

export default function FlashcardFront({
  text,
  savedAudioUrl,
  frontInterpolate,
  frontOpacity,
  flipCard,
  isFlipped,
}: FlascardFrontProps) {
  const { theme } = useTheme();
  return (
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
            {text}
          </Text>
          {savedAudioUrl && (
            <Ionicons
              name="volume-high"
              size={32}
              color={theme.colors.accent}
              style={styles.audioIcon}
            />
          )}
        </View>
        <Text variant="body" color="secondary" center style={styles.tapHint}>
          Tap to show definition
        </Text>
      </TouchableOpacity>
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
  cardFront: {
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
});
