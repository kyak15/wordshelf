import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../../theme";

export type SocialProvider = "google" | "apple";

interface SocialSignInButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const providerConfig: Record<
  SocialProvider,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  google: {
    label: "Continue with Google",
    icon: "logo-google",
  },
  apple: {
    label: "Continue with Apple",
    icon: "logo-apple",
  },
};

export const SocialSignInButton: React.FC<SocialSignInButtonProps> = ({
  provider,
  onPress,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const config = providerConfig[provider];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.divider,
        },
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primaryText} />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons
              name={config.icon}
              size={20}
              color={theme.colors.primaryText}
            />
          </View>
          <Text variant="body">{config.label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
});
