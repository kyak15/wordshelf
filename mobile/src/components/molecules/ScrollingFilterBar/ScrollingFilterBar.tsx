import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FilterPill } from "../../atoms/FilterPill";

export interface FilterOption {
  id: string;
  label: string;
}

interface ScrollingFilterBarProps {
  filters: FilterOption[];
  activeFilterId: string | null;
  onFilterSelect: (filterId: string) => void;
}

export const ScrollingFilterBar: React.FC<ScrollingFilterBarProps> = ({
  filters,
  activeFilterId,
  onFilterSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <FilterPill
            key={filter.id}
            title={filter.label}
            isActive={activeFilterId === filter.id}
            onPress={() => onFilterSelect(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});
