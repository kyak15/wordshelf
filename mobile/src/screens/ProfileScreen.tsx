import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Spacer } from "../components/atoms";
import { useTheme } from "../theme";
import { useAuth } from "../context/AuthContext";

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <View style={styles.content}>
        <Text variant="h1">Profile</Text>
        <Spacer size="md" />
        <Text variant="body" color="secondary">
          {user?.display_name || "Reader"}
        </Text>
        <Spacer size="sm" />
        <Text variant="caption" color="secondary">
          {user?.email}
        </Text>
        <Spacer size="xl" />

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: theme.colors.divider }]}
          onPress={signOut}
        >
          <Text variant="body" color="secondary">
            Sign Out
          </Text>
        </TouchableOpacity>
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
    paddingTop: 24,
  },
  signOutButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
});
