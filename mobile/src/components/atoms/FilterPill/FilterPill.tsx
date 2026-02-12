import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../Text";
import { useTheme } from "../../../theme";

interface FilterPillProps {
  title: string;
  isActive?: boolean;
  onPress: () => void;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  title,
  isActive = false,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isActive
            ? theme.colors.accent
            : theme.colors.surface,
          borderColor: isActive ? theme.colors.accent : theme.colors.divider,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        variant="bodySmall"
        style={[
          styles.text,
          { color: isActive ? "#FFFFFF" : theme.colors.primaryText },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  text: {
    fontWeight: "500",
  },
});
