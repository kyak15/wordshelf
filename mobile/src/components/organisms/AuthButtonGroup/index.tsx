import React from "react";
import { View, StyleSheet } from "react-native";
import { SocialSignInButton, SocialProvider } from "../../molecules/SocialSignInButton";
import { Spacer } from "../../atoms/Spacer";

interface AuthButtonGroupProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onEmailPress?: () => void;
  loadingProvider?: SocialProvider | null;
  enabledProviders?: SocialProvider[];
}

export const AuthButtonGroup: React.FC<AuthButtonGroupProps> = ({
  onGooglePress,
  onApplePress,
  onEmailPress,
  loadingProvider = null,
  enabledProviders = ["google"], // Default to only Google for now
}) => {
  const isLoading = loadingProvider !== null;

  return (
    <View style={styles.container}>
      {enabledProviders.includes("google") && onGooglePress && (
        <>
          <SocialSignInButton
            provider="google"
            onPress={onGooglePress}
            loading={loadingProvider === "google"}
            disabled={isLoading && loadingProvider !== "google"}
          />
          <Spacer size="sm" />
        </>
      )}

      {enabledProviders.includes("apple") && onApplePress && (
        <>
          <SocialSignInButton
            provider="apple"
            onPress={onApplePress}
            loading={loadingProvider === "apple"}
            disabled={isLoading && loadingProvider !== "apple"}
          />
          <Spacer size="sm" />
        </>
      )}

      {enabledProviders.includes("email") && onEmailPress && (
        <SocialSignInButton
          provider="email"
          onPress={onEmailPress}
          loading={loadingProvider === "email"}
          disabled={isLoading && loadingProvider !== "email"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
