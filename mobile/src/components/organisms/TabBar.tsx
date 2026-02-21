import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme";
import { Text } from "../atoms/Text";
import { AddBookModal } from "./AddBookModal";
import { AddWordModal } from "./AddWordModal";

type TabIconName = "home" | "layers" | "add" | "stats-chart" | "person";

interface TabConfig {
  icon: TabIconName;
  iconOutline: TabIconName | `${TabIconName}-outline`;
  label: string;
  isAddButton?: boolean;
}

const TAB_CONFIG: Record<string, TabConfig> = {
  Home: { icon: "home", iconOutline: "home-outline", label: "Home" },
  Flashcards: { icon: "layers", iconOutline: "layers-outline", label: "Cards" },
  Add: { icon: "add", iconOutline: "add", label: "Add", isAddButton: true },
  Stats: {
    icon: "stats-chart",
    iconOutline: "stats-chart-outline",
    label: "Stats",
  },
  Profile: { icon: "person", iconOutline: "person-outline", label: "Profile" },
};

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  const handleAddOption = (option: "word" | "book") => {
    setShowAddModal(false);
    if (option === "book") {
      setTimeout(() => {
        setShowAddBookModal(true);
      }, 200);
    } else {
      // TODO: Navigate to add word flow
      setTimeout(() => {
        setShowAddWordModal(true);
      }, 200);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.divider,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const config = TAB_CONFIG[route.name];
          const isFocused = state.index === index;

          if (!config) return null;

          const onPress = () => {
            if (config.isAddButton) {
              handleAddPress();
              return;
            }

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (config.isAddButton) {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityLabel="Add new word or book"
                onPress={onPress}
                style={styles.tabItem}
              >
                <View
                  style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.accent },
                  ]}
                >
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            );
          }

          const iconName = isFocused ? config.icon : config.iconOutline;
          const color = isFocused
            ? theme.colors.accent
            : theme.colors.secondaryText;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={(options as { tabBarTestID?: string }).tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={24}
                color={color}
              />
              <Text variant="caption" style={[styles.label, { color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAddModal(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                marginBottom: insets.bottom + 80,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modalOption,
                { borderBottomColor: theme.colors.divider },
              ]}
              onPress={() => handleAddOption("word")}
            >
              <Ionicons
                name="text"
                size={24}
                color={theme.colors.accent}
                style={styles.modalIcon}
              />
              <View style={styles.modalOptionText}>
                <Text variant="body">Add Word</Text>
                <Text variant="caption" color="secondary">
                  Save a new vocabulary word
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleAddOption("book")}
            >
              <Ionicons
                name="book"
                size={24}
                color={theme.colors.accent}
                style={styles.modalIcon}
              />
              <View style={styles.modalOptionText}>
                <Text variant="body">Add Book</Text>
                <Text variant="caption" color="secondary">
                  Add a book to your library
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <AddBookModal
        visible={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
      />
      <AddWordModal
        visible={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalIcon: {
    marginRight: 16,
  },
  modalOptionText: {
    flex: 1,
  },
});
