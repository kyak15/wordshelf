import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { StatDisplay } from "../../atoms/StatDisplay";

interface MiniProgressCardProps {
  streak: number;
  weeklyReview: number;
  totalWords: number;
}

export const MiniProgressCard: React.FC<MiniProgressCardProps> = ({
  streak,
  weeklyReview,
  totalWords,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <StatDisplay
        icon="flame"
        value={streak}
        label="day streak"
        color="#FF6B35"
      />
      <StatDisplay
        icon="repeat"
        value={weeklyReview}
        label="words reviewed this week"
        color="#4ECDC4"
      />
      <StatDisplay
        icon="book"
        value={totalWords}
        label="total words"
        color="#95B8D1"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
