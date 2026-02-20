import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../theme";
import { Text } from "../Text";

type IconName = "flame" | "book" | "repeat" | "bar-chart" | "pencil";

interface StatDisplayProps {
  icon: IconName;
  value: number | string;
  label: string;
  color?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  icon,
  value,
  label,
  color,
}) => {
  const { theme } = useTheme();

  const iconMap: Record<IconName, keyof typeof Ionicons.glyphMap> = {
    flame: "flame",
    book: "book",
    repeat: "repeat",
    "bar-chart": "bar-chart",
    pencil: "pencil",
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: color ? `${color}20` : theme.colors.surface },
        ]}
      >
        <Ionicons
          name={iconMap[icon]}
          size={24}
          color={color || theme.colors.accent}
        />
      </View>
      <View style={styles.textContainer}>
        <Text variant="h2" style={styles.value}>
          {typeof value === "number" ? value.toString() : value}
        </Text>
        <Text variant="caption" color="secondary" style={styles.label}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontWeight: "700",
    marginBottom: 2,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
  },
});
