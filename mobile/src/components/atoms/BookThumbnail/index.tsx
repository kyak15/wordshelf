import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../../../theme";
import { Ionicons } from "@expo/vector-icons";

type ThumbnailSize = "small" | "medium" | "large";

interface BookThumbnailProps {
  uri?: string | null;
  size?: ThumbnailSize;
}

const sizeConfig: Record<ThumbnailSize, { width: number; height: number }> = {
  small: { width: 48, height: 72 },
  medium: { width: 64, height: 96 },
  large: { width: 96, height: 144 },
};

export const BookThumbnail: React.FC<BookThumbnailProps> = ({
  uri,
  size = "medium",
}) => {
  const { theme } = useTheme();
  const dimensions = sizeConfig[size];

  if (!uri) {
    return (
      <View
        style={[
          styles.placeholder,
          {
            ...dimensions,
            backgroundColor: theme.colors.divider,
          },
        ]}
      >
        <Ionicons
          name="book-outline"
          size={dimensions.width * 0.5}
          color={theme.colors.secondaryText}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, dimensions]}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 4,
  },
  placeholder: {
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
