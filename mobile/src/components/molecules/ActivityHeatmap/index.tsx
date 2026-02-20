import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";

interface ActivityDay {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityDay[];
}
export default function ActivityHeatMap({ data }: ActivityHeatmapProps) {
  const { theme } = useTheme();

  const getLast30Days = () => {
    const days: ActivityDay[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      const dayData = data.find((d) => d.date === dateString);
      days.push({
        date: dateString,
        count: dayData?.count || 0,
      });
    }

    return days;
  };

  const days = getLast30Days();

  const getColor = (count: number) => {
    if (count === 0) return theme.colors.divider;
    if (count < 5) return "#A8E6CF"; // Light green
    if (count < 10) return "#56C596"; // Medium green
    if (count < 20) return "#2D9B6F"; // Dark green
    return "#1A7A4E"; // Very dark green
  };

  // Split into rows of 7 (weeks)
  const rows: ActivityDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="h3" style={styles.title}>
        Last 30 Days Activity
      </Text>
      <Text variant="caption" color="secondary" style={styles.subtitle}>
        Words reviewed per day
      </Text>

      <View style={styles.heatmap}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[styles.cell, { backgroundColor: getColor(day.count) }]}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text variant="caption" color="secondary" style={styles.legendText}>
          Less
        </Text>
        <View
          style={[styles.legendCell, { backgroundColor: theme.colors.divider }]}
        />
        <View style={[styles.legendCell, { backgroundColor: "#A8E6CF" }]} />
        <View style={[styles.legendCell, { backgroundColor: "#56C596" }]} />
        <View style={[styles.legendCell, { backgroundColor: "#2D9B6F" }]} />
        <View style={[styles.legendCell, { backgroundColor: "#1A7A4E" }]} />
        <Text variant="caption" color="secondary" style={styles.legendText}>
          More
        </Text>
      </View>
    </View>
  );
}

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
    marginBottom: 16,
  },
  heatmap: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  cell: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 4,
  },
  legendCell: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
  },
});
