import React from "react";
import { View, StyleSheet } from "react-native";
import {
  SocialSignInButton,
  SocialProvider,
} from "../../molecules/SocialSignInButton";
import { Spacer } from "../../atoms/Spacer";

interface AuthButtonGroupProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  loadingProvider?: SocialProvider | null;
  enabledProviders?: SocialProvider[];
}

export const AuthButtonGroup: React.FC<AuthButtonGroupProps> = ({
  onGooglePress,
  onApplePress,
  loadingProvider = null,
  enabledProviders = ["google"],
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
        <SocialSignInButton
          provider="apple"
          onPress={onApplePress}
          loading={loadingProvider === "apple"}
          disabled={isLoading && loadingProvider !== "apple"}
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
