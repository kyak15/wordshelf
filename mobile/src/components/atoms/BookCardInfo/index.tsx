import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../Text";

interface BookCardInfoProps {
  title: string;
  author?: string | null;
}

export const BookCardInfo: React.FC<BookCardInfoProps> = ({
  title,
  author,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {author && (
        <Text variant="caption" color="secondary" numberOfLines={1}>
          {author}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  title: {
    fontWeight: "600",
  },
});
