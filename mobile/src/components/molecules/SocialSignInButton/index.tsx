import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../../theme";

export type SocialProvider = "google" | "apple" | "email";

interface SocialSignInButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const providerConfig: Record<
  SocialProvider,
  { label: string; iconPlaceholder: string }
> = {
  google: {
    label: "Continue with Google",
    iconPlaceholder: "G",
  },
  apple: {
    label: "Continue with Apple",
    iconPlaceholder: "",
  },
  email: {
    label: "Continue with Email",
    iconPlaceholder: "✉",
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
            <Text variant="body">{config.iconPlaceholder}</Text>
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
