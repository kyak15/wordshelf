import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../components/atoms/Text";
import { Spacer } from "../components/atoms/Spacer";
import { useTheme } from "../theme";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  onPress,
  rightElement,
  destructive,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.settingsRow, { borderBottomColor: theme.colors.divider }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingsRowLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? "#E53935" : theme.colors.secondaryText}
          style={styles.settingsIcon}
        />
        <Text
          variant="body"
          style={destructive ? { color: "#E53935" } : undefined}
        >
          {label}
        </Text>
      </View>
      {rightElement ? (
        rightElement
      ) : value ? (
        <View style={styles.settingsRowRight}>
          <Text variant="body" color="secondary">
            {value}
          </Text>
          {onPress && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.secondaryText}
            />
          )}
        </View>
      ) : onPress ? (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.secondaryText}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export const ProfileScreen: React.FC = () => {
  const { theme, colorScheme, setColorScheme } = useTheme();
  const { user, signOut } = useAuth();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [emailStep, setEmailStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);

  const isDarkMode = colorScheme === "dark";

  const handleThemeToggle = () => {
    setColorScheme(isDarkMode ? "light" : "dark");
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.deleteAccount();
              await signOut();
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "Failed to delete account"
              );
            }
          },
        },
      ]
    );
  };

  const handleChangeEmail = () => {
    setNewEmail("");
    setOtpCode("");
    setEmailStep("email");
    setShowEmailModal(true);
  };

  const handleSendOtp = async () => {
    if (!newEmail.trim()) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await authService.startEmailChange(newEmail.trim());
      setEmailStep("otp");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    try {
      await authService.confirmEmailChange(newEmail.trim(), otpCode.trim());
      setShowEmailModal(false);
      Alert.alert("Success", "Your email has been updated successfully");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to verify code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Profile
          </Text>
        </View>

        {/* User Info Card */}
        <View
          style={[styles.userCard, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.accent }]}
            >
              <Text variant="h2" style={styles.avatarText}>
                {(user?.display_name || user?.email || "U")[0].toUpperCase()}
              </Text>
            </View>
          </View>
          <Spacer size="sm" />
          <Text variant="h3" center>
            {user?.display_name || "Reader"}
          </Text>
          <Text variant="caption" color="secondary" center>
            {user?.email}
          </Text>
        </View>

        <Spacer size="lg" />

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text variant="caption" color="secondary" style={styles.sectionTitle}>
            APPEARANCE
          </Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <SettingsRow
              icon="moon-outline"
              label="Dark Mode"
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={handleThemeToggle}
                  trackColor={{
                    false: theme.colors.divider,
                    true: theme.colors.accent,
                  }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        <Spacer size="lg" />

        {/* Account Section */}
        <View style={styles.section}>
          <Text variant="caption" color="secondary" style={styles.sectionTitle}>
            ACCOUNT
          </Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <SettingsRow
              icon="mail-outline"
              label="Change Email"
              value={user?.email || "Not set"}
              onPress={handleChangeEmail}
            />
            <SettingsRow
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleSignOut}
            />
          </View>
        </View>

        <Spacer size="lg" />

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text variant="caption" color="secondary" style={styles.sectionTitle}>
            DANGER ZONE
          </Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <SettingsRow
              icon="trash-outline"
              label="Delete Account"
              onPress={handleDeleteAccount}
              destructive
            />
          </View>
        </View>

        <Spacer size="xl" />

        {/* App Version */}
        <Text variant="caption" color="secondary" center>
          WordShelf v1.0.0
        </Text>
      </ScrollView>

      {/* Change Email Modal */}
      <Modal
        visible={showEmailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEmailModal(false)}>
              <Text variant="body" color="secondary">
                Cancel
              </Text>
            </TouchableOpacity>
            <Text variant="h3">Change Email</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.modalContent}>
            {emailStep === "email" ? (
              <>
                <Text variant="body" color="secondary" center>
                  Enter your new email address. We'll send a verification code
                  to confirm it's yours.
                </Text>
                <Spacer size="lg" />
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.primaryText,
                      borderColor: theme.colors.divider,
                    },
                  ]}
                  placeholder="New email address"
                  placeholderTextColor={theme.colors.secondaryText}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Spacer size="lg" />
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.colors.accent },
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  <Text variant="body" style={{ color: "#FFFFFF" }}>
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text variant="body" color="secondary" center>
                  Enter the 6-digit code we sent to {newEmail}
                </Text>
                <Spacer size="lg" />
                <TextInput
                  style={[
                    styles.input,
                    styles.otpInput,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.primaryText,
                      borderColor: theme.colors.divider,
                    },
                  ]}
                  placeholder="000000"
                  placeholderTextColor={theme.colors.secondaryText}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Spacer size="lg" />
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: theme.colors.accent },
                    isLoading && styles.disabledButton,
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <Text variant="body" style={{ color: "#FFFFFF" }}>
                    {isLoading ? "Verifying..." : "Confirm Email Change"}
                  </Text>
                </TouchableOpacity>
                <Spacer size="md" />
                <TouchableOpacity onPress={() => setEmailStep("email")}>
                  <Text variant="body" color="secondary" center>
                    Use a different email
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontWeight: "700",
  },
  userCard: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "600",
  },
  settingsCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingsRowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    marginRight: 12,
  },
  settingsRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  otpInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
