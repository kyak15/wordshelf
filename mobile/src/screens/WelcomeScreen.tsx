import React, { useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Spacer } from "../components/atoms";
import { AppLogo } from "../components/molecules";
import { AuthButtonGroup } from "../components/organisms";
import { useTheme } from "../theme";
import { useGoogleAuth } from "../hooks";
import { useAuth } from "../context/AuthContext";

export const WelcomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { devSkipAuth } = useAuth();
  const {
    signIn: googleSignIn,
    loading: googleLoading,
    error: googleError,
  } = useGoogleAuth();

  useEffect(() => {
    if (googleError) {
      Alert.alert("Sign In Error", googleError);
    }
  }, [googleError]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <AppLogo size="large" />
          <Spacer size="xl" />
          <Text variant="h1" center>
            Welcome to WordShelf
          </Text>
          <Spacer size="md" />
          <Text variant="body" color="secondary" center>
            The app to learn words you find while reading
          </Text>
        </View>

        <View style={styles.authSection}>
          <AuthButtonGroup
            onGooglePress={googleSignIn}
            loadingProvider={googleLoading ? "google" : null}
            enabledProviders={["google"]}
          />

          {__DEV__ && (
            <>
              <Spacer size="lg" />
              <TouchableOpacity
                style={[
                  styles.devButton,
                  { borderColor: theme.colors.divider },
                ]}
                onPress={devSkipAuth}
              >
                <Text variant="bodySmall" color="secondary">
                  Skip Auth (Dev Only)
                </Text>
              </TouchableOpacity>
            </>
          )}
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
  devButton: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
  },
});
