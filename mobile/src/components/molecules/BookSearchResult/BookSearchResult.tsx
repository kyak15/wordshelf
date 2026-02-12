import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms";
import { GoogleBookResult } from "../../../types";

interface BookSearchResultProps {
  book: GoogleBookResult;
  onPress: (book: GoogleBookResult) => void;
  isAdding?: boolean;
}

export const BookSearchResult: React.FC<BookSearchResultProps> = ({
  book,
  onPress,
  isAdding = false,
}) => {
  const { theme } = useTheme();

  const authorText =
    book.authors.length > 0 ? book.authors.join(", ") : "Unknown author";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.divider,
        },
      ]}
      onPress={() => onPress(book)}
      activeOpacity={0.7}
      disabled={isAdding}
    >
      {/* Book Cover */}
      <View
        style={[
          styles.coverContainer,
          { backgroundColor: theme.colors.divider },
        ]}
      >
        {book.coverUrl ? (
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name="book-outline"
            size={24}
            color={theme.colors.secondaryText}
          />
        )}
      </View>

      {/* Book Info */}
      <View style={styles.info}>
        <Text variant="body" numberOfLines={2}>
          {book.title}
        </Text>
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {authorText}
        </Text>
      </View>

      {/* Add indicator */}
      <View style={styles.addIndicator}>
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={theme.colors.accent}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  coverContainer: {
    width: 48,
    height: 72,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  addIndicator: {
    marginLeft: 8,
  },
});
