import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../../theme";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Placeholder Icon component
 * TODO: Replace with actual icon library (e.g., @expo/vector-icons)
 */
export const Icon: React.FC<IconProps> = ({ size = 24, color, style }) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.primaryText;

  return (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderColor: iconColor,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    borderWidth: 1,
    borderRadius: 4,
  },
});
