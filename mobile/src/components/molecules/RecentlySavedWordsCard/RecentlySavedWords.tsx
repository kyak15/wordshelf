import { View } from "react-native";
import SimpleWordCard from "../../atoms/SimpleWordCard/SimpleWordCard";
import { useWords } from "../../../hooks/queries/useWords";
import { LoadingSpinner } from "../../atoms";

interface RecentlySavedWordsCardProps {
  listLength?: number;
}

export default function RecentlySavedWordsCard({
  listLength,
}: RecentlySavedWordsCardProps) {
  const { data, isLoading, isError } = useWords();

  const finalData = listLength ? data?.slice(0, listLength) : data;

  return (
    <View>
      {isLoading ?? <LoadingSpinner />}
      {finalData?.map((word) => (
        <SimpleWordCard
          key={word.saved_word_id}
          word={word.text}
          definition={word.saved_definition}
        />
      ))}
    </View>
  );
}
