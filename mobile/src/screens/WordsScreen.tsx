// WordsScreen.tsx or WordsContent.tsx

import { useState } from "react";
import { View, FlatList } from "react-native";
import {
  ScrollingFilterBar,
  SavedWordCard,
  type FilterOption,
} from "../components/molecules";
import { useWords } from "../hooks/queries/useWords";

export const WordsContent = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>("all");

  // Get all words (you already have this hook)
  const { data: words, isLoading } = useWords();

  // Define your filter options
  const filters: FilterOption[] = [
    { id: "all", label: "All Words" },
    { id: "learning", label: "Learning" },
    { id: "reviewing", label: "Reviewing" },
    { id: "familiar", label: "Familiar" },
    { id: "mastered", label: "Mastered" },
    // You can add book filters dynamically too
  ];

  // Filter words based on active filter
  const filteredWords = words?.filter((word) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "learning") return word.mastery_level === 0;
    if (activeFilter === "reviewing") return word.mastery_level === 1;
    if (activeFilter === "familiar") return word.mastery_level === 2;
    if (activeFilter === "mastered") return word.mastery_level === 3;

    // Book filters would check word.library_book_id
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Filter Bar */}
      <ScrollingFilterBar
        filters={filters}
        activeFilterId={activeFilter}
        onFilterSelect={setActiveFilter}
      />

      {/* Words List */}
      <FlatList
        data={filteredWords}
        keyExtractor={(item) => item.saved_word_id}
        renderItem={({ item }) => (
          <SavedWordCard
            word={item}
            onPress={() => {
              // Navigate to word detail or open edit modal
              navigation.navigate("WordDetail", { wordId: item.saved_word_id });
            }}
            showMasteryLevel
          />
        )}
      />
    </View>
  );
};
