import { View, StyleSheet } from "react-native";
import { Text } from "../Text";

interface MasteryStatsLeveLHeadProps {
  color: string;
  label: string;
}

export default function MasteryStatsLevelHead({
  color,
  label,
}: MasteryStatsLeveLHeadProps) {
  return (
    <View style={styles.levelInfo}>
      <View style={[styles.colorDot, { backgroundColor: color }]} />
      <Text variant="body" style={styles.levelLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  levelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  levelLabel: {
    fontWeight: "600",
  },
});
