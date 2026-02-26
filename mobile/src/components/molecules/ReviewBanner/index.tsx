import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";

interface ReviewBannerProps {
  wordsDue: number;
  onStartReview: () => void;
}

export const ReviewBanner: React.FC<ReviewBannerProps> = ({
  wordsDue,
  onStartReview,
}) => {
  const { theme } = useTheme();

  if (wordsDue === 0) return null;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.accent,
        },
      ]}
      onPress={onStartReview}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="flash" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text variant="body" style={styles.title}>
            {wordsDue} {wordsDue === 1 ? "word" : "words"} due for review
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Tap to start your review session
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 22,
  },
  subtitle: {
    color: "#FFFFFF",
    opacity: 0.9,
  },
});
