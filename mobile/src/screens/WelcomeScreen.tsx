import React from "react";
import { View, StyleSheet, Alert, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text } from "../components/atoms/Text";
import { Spacer } from "../components/atoms/Spacer";
import AppLogo from "../components/molecules/AppLogo";
import { AuthButtonGroup } from "../components/organisms/AuthButtonGroup";
import { useTheme } from "../theme";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Welcome">;

export const WelcomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { signInWithGoogle, signInWithApple, isAppleSignInAvailable, isLoading, error } = useAuth();
  const [loadingProvider, setLoadingProvider] = React.useState<
    "google" | "apple" | null
  >(null);

  const handleGooglePress = async () => {
    try {
      setLoadingProvider("google");
      await signInWithGoogle();
      // On success, navigation will happen automatically via AuthContext status change
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleApplePress = async () => {
    try {
      setLoadingProvider("apple");
      await signInWithApple();
      // On success, navigation will happen automatically via AuthContext status change
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Apple";
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <AppLogo size="large" />
          <Spacer size="xl" />
          <Text variant="h1" center>
            Welcome to WordVault
          </Text>
          <Spacer size="md" />
          <Text variant="body" color="secondary" center>
            The app to learn words you find while reading
          </Text>
        </View>

        <View style={styles.authSection}>
          <AuthButtonGroup
            onGooglePress={handleGooglePress}
            onApplePress={isAppleSignInAvailable ? handleApplePress : undefined}
            enabledProviders={
              isAppleSignInAvailable ? ["apple", "google"] : ["google"]
            }
            loadingProvider={loadingProvider}
          />
          <Spacer size="md" />
          <View style={styles.legalRow}>
            <View style={styles.legalTextRow}>
              <Text variant="caption" color="secondary">
                By continuing, you agree to our{" "}
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://wordvaultvocab.netlify.app/terms")
                }
                hitSlop={8}
              >
                <Text
                  variant="caption"
                  style={[styles.legalLink, { color: theme.colors.accent }]}
                >
                  Terms of Service
                </Text>
              </Pressable>
              <Text variant="caption" color="secondary">
                {" "}
                and{" "}
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://wordvaultvocab.netlify.app/privacy")
                }
                hitSlop={8}
              >
                <Text
                  variant="caption"
                  style={[styles.legalLink, { color: theme.colors.accent }]}
                >
                  Privacy Policy
                </Text>
              </Pressable>
              <Text variant="caption" color="secondary">
                .
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  authSection: {
    paddingBottom: 48,
  },
  legalRow: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  legalTextRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  legalLink: {
    textDecorationLine: "underline",
  },
});
