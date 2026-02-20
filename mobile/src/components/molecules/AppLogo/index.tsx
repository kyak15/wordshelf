import React from "react";
import { View, Text as RNText, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
}

/**
 * App Logo Placeholder
 * TODO: Replace with actual logo image
 */

export default function AppLogo({ size = "medium" }: AppLogoProps) {
  const { theme } = useTheme();

  const getContainerStyle = () => {
    switch (size) {
      case "small":
        return styles.containerSmall;
      case "large":
        return styles.containerLarge;
      default:
        return styles.containerMedium;
    }
  };

  const getTextStyle = () => {
    switch (size) {
      case "small":
        return styles.textSmall;
      case "large":
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  return (
    <View
      style={[
        styles.container,
        getContainerStyle(),
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.divider,
        },
      ]}
    >
      <RNText style={[getTextStyle(), { color: theme.colors.accent }]}>
        W
      </RNText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 2,
  },
  containerSmall: {
    width: 48,
    height: 48,
  },
  containerMedium: {
    width: 80,
    height: 80,
  },
  containerLarge: {
    width: 120,
    height: 120,
  },
  textSmall: {
    fontSize: 24,
    fontWeight: "700",
  },
  textMedium: {
    fontSize: 40,
    fontWeight: "700",
  },
  textLarge: {
    fontSize: 60,
    fontWeight: "700",
  },
});
