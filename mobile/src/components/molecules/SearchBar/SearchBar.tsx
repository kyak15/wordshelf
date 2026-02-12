import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../atoms";
import { useTheme } from "../../../theme";
import { Dispatch, SetStateAction } from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  handleSearch: () => void;
  searchState: string;
  placeholder?: string;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchState,
  placeholder = "",
}: SearchBarProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View
        style={[
          styles.searchInputContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.divider,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.secondaryText}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.primaryText }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, { backgroundColor: theme.colors.accent }]}
        onPress={handleSearch}
        disabled={!searchQuery.trim() || searchState === "loading"}
      >
        <Text variant="body" style={styles.searchButtonText}>
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  searchButton: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchIcon: {
    marginRight: 8,
  },

  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
});
