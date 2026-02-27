import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
}

const logoSource = require("../../../../assets/wordvault-icon.jpg");

/**
 * App Logo – Word Vault WV lettermark
 */
export default function AppLogo({ size = "medium" }: AppLogoProps) {
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

  const dimensions = getContainerStyle();

  return (
    <View style={[styles.container, dimensions]}>
      <Image
        source={logoSource}
        style={[dimensions, styles.image]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});
