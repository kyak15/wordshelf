import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";

interface ProgressBarProps {
  /** Progress value between 0 and 1 */
  progress: number;
  /** Height of the progress bar in pixels */
  height?: number;
  /** Optional custom color for the filled portion */
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color,
}) => {
  const { theme } = useTheme();
  const fillColor = color || theme.colors.accent;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.colors.divider,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});
