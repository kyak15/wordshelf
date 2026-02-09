import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../Text";
import { ProgressBar } from "../ProgressBar";

interface BookCardProgressProps {
  currentPage: number;
  totalPages: number;
}

export const BookCardProgress: React.FC<BookCardProgressProps> = ({
  currentPage,
  totalPages,
}) => {
  const progress = totalPages > 0 ? currentPage / totalPages : 0;

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      <Text variant="caption" color="secondary" style={styles.text}>
        Page {currentPage} of {totalPages}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  text: {
    marginTop: 2,
  },
});
