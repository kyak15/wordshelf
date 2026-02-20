import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms/Text";

interface Milestone {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color: string;
}

interface MilestonesCardProps {
  milestones: Milestone[];
}

export default function MilestonesCard({ milestones }: MilestonesCardProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text variant="h3" style={styles.title}>
        Milestones
      </Text>

      <View style={styles.milestones}>
        {milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneRow}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${milestone.color}20` },
              ]}
            >
              <Ionicons
                name={milestone.icon}
                size={24}
                color={milestone.color}
              />
            </View>

            <View style={styles.milestoneInfo}>
              <Text variant="body" style={styles.milestoneLabel}>
                {milestone.label}
              </Text>
              <Text
                variant="h3"
                style={[styles.milestoneValue, { color: milestone.color }]}
              >
                {milestone.value}
              </Text>
            </View>
          </View>
        ))}
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
    marginBottom: 16,
  },
  milestones: {
    gap: 16,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneLabel: {
    color: "#666",
    marginBottom: 2,
  },
  milestoneValue: {
    fontWeight: "700",
  },
});
