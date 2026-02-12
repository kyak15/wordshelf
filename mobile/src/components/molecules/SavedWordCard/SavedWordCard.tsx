import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms";
import { SavedWordRow } from "../../../types";

interface SavedWordCardProps {
  word: SavedWordRow;
  onPress?: () => void;
  showBookInfo?: boolean;
  showMasteryLevel?: boolean;
}

export const SavedWordCard: React.FC<SavedWordCardProps> = ({
  word,
  onPress,
  showBookInfo = false,
  showMasteryLevel = true,
}) => {
  const { theme } = useTheme();

  // Map mastery level to color and label
  const getMasteryInfo = (level: number) => {
    switch (level) {
      case 0:
        return { color: "#E53935", label: "Learning" };
      case 1:
        return { color: "#FF9800", label: "Reviewing" };
      case 2:
        return { color: "#FDD835", label: "Familiar" };
      case 3:
        return { color: "#7CB342", label: "Mastered" };
      default:
        return { color: theme.colors.secondaryText, label: "Unknown" };
    }
  };

  const masteryInfo = getMasteryInfo(word.mastery_level);

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.divider,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Word Header */}
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <View style={styles.titleRow}>
            <Text variant="h3" style={styles.wordText}>
              {word.text}
            </Text>
            {word.saved_audio_url && (
              <Ionicons
                name="volume-high"
                size={20}
                color={theme.colors.secondaryText}
                style={styles.audioIcon}
              />
            )}
          </View>

          {word.saved_part_of_speech && (
            <Text
              variant="caption"
              color="secondary"
              style={styles.partOfSpeech}
            >
              {word.saved_part_of_speech}
            </Text>
          )}
        </View>

        {/* Mastery Level Badge */}
        {showMasteryLevel && (
          <View
            style={[
              styles.masteryBadge,
              { backgroundColor: masteryInfo.color + "20" },
            ]}
          >
            <View
              style={[
                styles.masteryDot,
                { backgroundColor: masteryInfo.color },
              ]}
            />
          </View>
        )}
      </View>

      {/* Definition */}
      {word.saved_definition && (
        <Text variant="body" color="secondary" style={styles.definition}>
          {word.saved_definition}
        </Text>
      )}

      {/* Example */}
      {word.saved_example && (
        <Text variant="caption" color="secondary" style={styles.example}>
          "{word.saved_example}"
        </Text>
      )}

      {/* Optional: Book Info or Context */}
      {showBookInfo && word.context_snippet && (
        <View
          style={[
            styles.contextContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text variant="caption" color="secondary" style={styles.context}>
            {word.context_snippet}
          </Text>
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  wordText: {
    marginRight: 8,
  },
  audioIcon: {
    marginTop: 2,
  },
  partOfSpeech: {
    fontStyle: "italic",
    textTransform: "capitalize",
  },
  masteryBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  masteryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  definition: {
    lineHeight: 20,
    marginBottom: 8,
  },
  example: {
    fontStyle: "italic",
    marginTop: 4,
  },
  contextContainer: {
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
  },
  context: {
    fontStyle: "italic",
  },
});
