import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTheme } from "../../../theme";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  /** Size of the spinner: sm (20), md (32), lg (48) */
  size?: SpinnerSize;
  /** Optional color override - defaults to accent color */
  color?: "accent" | "primary" | "secondary";
  /** Center the spinner in its container */
  centered?: boolean;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 20,
  md: 32,
  lg: 48,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "accent",
  centered = false,
}) => {
  const { theme } = useTheme();

  const colorMap = {
    accent: theme.colors.accent,
    primary: theme.colors.primaryText,
    secondary: theme.colors.secondaryText,
  };

  const spinner = (
    <ActivityIndicator size={sizeMap[size]} color={colorMap[color]} />
  );

  if (centered) {
    return <View style={styles.centered}>{spinner}</View>;
  }

  return spinner;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
