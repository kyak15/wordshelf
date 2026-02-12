import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Icon, Text } from "../../atoms";
import { DictionaryApiResponse } from "../../../types";

interface WordSearchResultProps {
  word: DictionaryApiResponse;
  onSelectDefinition: (
    definition: string,
    partOfSpeech: string,
    example?: string,
    audioUrl?: string
  ) => void;
  isAdding?: boolean;
}

export const WordSearchResult: React.FC<WordSearchResultProps> = ({
  word,
  onSelectDefinition,
  isAdding = false,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.divider,
        },
      ]}
    >
      {/* Word Header */}
      <View style={styles.header}>
        <View style={styles.wordInfo}>
          <View style={styles.title}>
            <Text variant="h3">{word.word}</Text>
            <Ionicons
              name="volume-high"
              size={24}
              color={theme.colors.secondaryText}
              style={styles.audioIcon}
            />
          </View>

          {word.phonetic && (
            <Text variant="caption" color="secondary" style={styles.phonetic}>
              {word.phonetic}
            </Text>
          )}
        </View>
        {word.phonetics &&
          word.phonetics.length > 0 &&
          word.phonetics[0].audio && (
            <Ionicons
              name="volume-medium-outline"
              size={24}
              color={theme.colors.accent}
            />
          )}
      </View>

      {/* Meanings */}
      {word.meanings.map((meaning, meaningIndex) => (
        <View key={meaningIndex} style={styles.meaningContainer}>
          <Text
            variant="bodySmall"
            color="secondary"
            style={styles.partOfSpeech}
          >
            {meaning.partOfSpeech}
          </Text>

          {meaning.definitions.slice(0, 3).map((def, defIndex) => (
            <TouchableOpacity
              key={defIndex}
              style={[
                styles.definitionItem,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.divider,
                },
              ]}
              onPress={() =>
                onSelectDefinition(
                  def.definition,
                  meaning.partOfSpeech,
                  def.example,
                  word.phonetics?.[0]?.audio
                )
              }
              activeOpacity={0.7}
              disabled={isAdding}
            >
              <View style={styles.definitionContent}>
                <Text variant="body" style={styles.definition}>
                  {defIndex + 1}. {def.definition}
                </Text>
                {def.example && (
                  <Text
                    variant="caption"
                    color="secondary"
                    style={styles.example}
                  >
                    "{def.example}"
                  </Text>
                )}
              </View>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
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
    alignItems: "center",
    marginBottom: 12,
  },
  wordInfo: {
    flex: 1,
  },
  phonetic: {
    marginTop: 4,
  },
  meaningContainer: {
    marginTop: 12,
  },
  partOfSpeech: {
    fontStyle: "italic",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  definitionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  definitionContent: {
    flex: 1,
  },
  definition: {
    lineHeight: 20,
  },
  example: {
    marginTop: 8,
    fontStyle: "italic",
  },
  title: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  audioIcon: {
    marginLeft: 10,
    marginTop: 3,
  },
});
