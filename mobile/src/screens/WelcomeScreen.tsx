import React from "react";
import { View, StyleSheet, Alert } from "react-native";
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
  const { signInWithGoogle, isLoading, error } = useAuth();
  const [loadingProvider, setLoadingProvider] = React.useState<
    "google" | "email" | null
  >(null);

  const handleEmailPress = () => {
    navigation.navigate("EmailAuth");
  };

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
            onEmailPress={handleEmailPress}
            enabledProviders={["google", "email"]}
            loadingProvider={loadingProvider}
          />
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
});
