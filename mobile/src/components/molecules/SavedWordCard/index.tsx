import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";
import { AudioButton } from "../../atoms/AudioButton";
import { SavedWordRow } from "shared/types";
import { getMasteryInfo } from "../../../constants/mastery";

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
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <View style={styles.titleRow}>
            <Text variant="h3" style={styles.wordText}>
              {word.text}
            </Text>
            <AudioButton audioUrl={word.saved_audio_url} size={20} />
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
