import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../../theme";
import { BookThumbnail, BookCardInfo, BookCardProgress } from "../../atoms";

interface BookCardProps {
  title: string;
  author: string;
  coverUri?: string | null;
  currentPage: number;
  totalPages: number;
  onPress?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  coverUri,
  currentPage,
  totalPages,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colorScheme === "dark" ? "#000" : "#2E2A24",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <BookThumbnail uri={coverUri} size="medium" />
      <View style={styles.content}>
        <BookCardInfo title={title} author={author} />
        <BookCardProgress currentPage={currentPage} totalPages={totalPages} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
});
