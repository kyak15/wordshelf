import { View, StyleSheet } from "react-native";
import { Text } from "../Text";

interface MasteryStatsLevelBarProps {
  color: string;
  percentage: number;
  count: number;
}

export default function MasteryStatsLevelBar({
  color,
  percentage,
  count,
}: MasteryStatsLevelBarProps) {
  return (
    <View style={styles.levelStats}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              backgroundColor: color,
              width: `${percentage}%`,
            },
          ]}
        />
      </View>
      <Text variant="body" style={styles.count}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  levelStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  count: {
    fontWeight: "700",
    width: 40,
    textAlign: "right",
  },
});
