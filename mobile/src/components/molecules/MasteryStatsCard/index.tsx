import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";
import MasteryStatsLevelHead from "../../atoms/MasteryStatsLevelHead";
import MasteryStatsLevelBar from "../../atoms/MasteryStatsLevelBar";

interface MasteryLevel {
  level: number;
  label: string;
  color: string;
  count: number;
}

interface MasteryStatsCardProps {
  levels: MasteryLevel[];
}

export const MasteryStatsCard: React.FC<MasteryStatsCardProps> = ({
  levels,
}) => {
  const { theme } = useTheme();
  const total = levels.reduce((sum, level) => sum + level.count, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="h3" style={styles.title}>
        Vocabulary Mastery
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        {total} total words
      </Text>

      <View style={styles.levels}>
        {levels.map((level) => {
          const percentage = total > 0 ? (level.count / total) * 100 : 0;
          return (
            <View key={level.level} style={styles.levelRow}>
              <MasteryStatsLevelHead color={level.color} label={level.label} />
              <MasteryStatsLevelBar
                color={level.color}
                percentage={percentage}
                count={level.count}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 20,
  },
  levels: {
    gap: 16,
  },
  levelRow: {
    gap: 12,
  },
  levelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
});
