import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../../atoms";

interface MasteryLevel {
  level: number;
  label: string;
  color: string;
  count: number;
}

interface MasteryBreakdownProps {
  levels: MasteryLevel[];
  onLevelPress?: (level: number) => void;
}

export const MasteryBreakdown: React.FC<MasteryBreakdownProps> = ({
  levels,
  onLevelPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {levels.map((item) => (
        <TouchableOpacity
          key={item.level}
          style={[
            styles.levelItem,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.divider,
            },
          ]}
          onPress={() => onLevelPress?.(item.level)}
          activeOpacity={0.7}
          disabled={!onLevelPress}
        >
          <View style={styles.leftContent}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text variant="body" style={styles.label}>
              {item.label}
            </Text>
          </View>
          <View style={styles.rightContent}>
            <Text variant="h3" style={styles.count}>
              {item.count}
            </Text>
            <Text variant="caption" color="secondary" style={styles.wordsText}>
              {item.count === 1 ? "word" : "words"}
            </Text>
            {onLevelPress && (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.secondaryText}
                style={styles.chevron}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  label: {
    fontWeight: "500",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    fontWeight: "700",
    marginRight: 4,
  },
  wordsText: {
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});
