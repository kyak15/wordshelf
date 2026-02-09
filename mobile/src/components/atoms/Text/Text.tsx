import React from "react";
import { Text as RNText, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";

type TextVariant = "h1" | "h2" | "h3" | "body" | "bodySmall" | "caption";

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: "primary" | "secondary" | "accent";
  style?: object;
  center?: boolean;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  color = "primary",
  style,
  center = false,
  numberOfLines,
}) => {
  const { theme } = useTheme();

  const colorMap = {
    primary: theme.colors.primaryText,
    secondary: theme.colors.secondaryText,
    accent: theme.colors.accent,
  };

  const getVariantStyle = () => {
    switch (variant) {
      case "h1":
        return styles.h1;
      case "h2":
        return styles.h2;
      case "h3":
        return styles.h3;
      case "bodySmall":
        return styles.bodySmall;
      case "caption":
        return styles.caption;
      default:
        return styles.body;
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: colorMap[color] },
        center ? styles.center : undefined,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  center: {
    textAlign: "center",
  },
});
